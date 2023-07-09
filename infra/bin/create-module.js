import path from "node:path";
import fs from "node:fs/promises";
import { TemplateCreator } from "./template-creator.js";
import { fieldsToTypeOrmConfig } from "./utils/fields-to-type-orm-config.js";
import { singularizeWord } from "./utils/singularize-word.js";
import { camelToSnakeCase } from "./utils/camel-to-snake-case.js";
import { formatObjectToCode } from "./utils/format-object-to-code.js";
import { fieldsToTypeBoxConfig } from "./utils/fields-to-type-box-config.js";
import { parseFields } from "./utils/parse-fields.js";
// eslint-disable-next-line node/no-unpublished-import
import prettier from "prettier";
import prettierConfig from "../../.prettierrc.cjs";
import { generateFieldDefinitions } from "./utils/generateFieldDefinitions.js";

const CLI_ARG_MODULE_NAME = "name";
const CLI_ARG_FIELDS = "fields";

const getArgValue = (argName) => {
  const foundArg = process.argv.find((arg) => arg.split("=")[0] === argName);
  if (!foundArg) throw new Error(`Parameter '${argName}' is not found`);
  return foundArg.split("=")[1];
};

const getModuleName = () => getArgValue(CLI_ARG_MODULE_NAME);
const getFieldsFromCliArgs = () => parseFields(getArgValue(CLI_ARG_FIELDS));

const createFolderStructure = async (folderPath) => {
  try {
    await fs.access(folderPath);
  } catch {
    await fs.mkdir(folderPath, { recursive: true });
  }
};

const writeFile = async (filePath, content) => {
  try {
    await fs.access(filePath);
    throw new Error(`File '${filePath}' already exists.`);
  } catch {
    const formattedContent = prettier.format(content, prettierConfig);
    await fs.writeFile(filePath, formattedContent);
  }
};

const fillTemplate = async (fileName, values) => {
  const templateContent = await TemplateCreator.getTemplate(fileName);
  return TemplateCreator.fillTemplate(templateContent, values);
};

const createFileFromTemplate = async (folderPath, fileName, templateName, values) => {
  const content = await fillTemplate(templateName, values);
  await writeFile(path.join(folderPath, fileName), content);
};

const createModuleFiles = async (folderPath, moduleName, fields) => {
  const toCamelCase = (srt) =>
    srt.toLowerCase().replace(/([_-][a-z])/g, (g) => g.toUpperCase().replace("-", "").replace("_", ""));
  const LowerCaseName = toCamelCase(moduleName);
  const UpperCaseName = moduleName[0].toUpperCase() + LowerCaseName.replace(moduleName[0], "");
  const SchemaName = camelToSnakeCase(moduleName);

  const attributes = fieldsToTypeOrmConfig(fields, UpperCaseName);

  const values = {
    ModuleName: moduleName,
    ModuleNameSingle: singularizeWord(moduleName),
    LowerCaseName,
    LowerCaseNameSingle: singularizeWord(LowerCaseName),
    UpperCaseName,
    UpperCaseNameSingle: singularizeWord(UpperCaseName),
    SchemaName,
    EntityFields: generateFieldDefinitions(attributes.columns),
    EntityAttributes: formatObjectToCode(attributes.columns),
    EntityRelations: Object.keys(attributes.relations).length ? formatObjectToCode(attributes.relations) : "",
    TypeBoxAttributes: fieldsToTypeBoxConfig(fields),
  };

  await createFileFromTemplate(folderPath, `${singularizeWord(moduleName)}.entity.js`, "model", values);
  await createFileFromTemplate(folderPath, `${moduleName}.schemas.js`, "schemas", values);
  await createFileFromTemplate(folderPath, `${moduleName}.router.v1.js`, "router", values);
  await createFileFromTemplate(folderPath, `types.d.ts`, "types", values);
};

const createModule = async () => {
  const moduleName = getModuleName();
  const fields = getFieldsFromCliArgs();
  const folderPath = path.join("src", "modules", moduleName.toLowerCase());

  await createFolderStructure(folderPath);
  await createModuleFiles(folderPath, moduleName, fields);
};

// eslint-disable-next-line no-console
createModule().catch((e) => console.error(e));
