import path from "node:path";
import fs from "node:fs/promises";
import * as readline from "node:readline";

// eslint-disable-next-line node/no-unpublished-import
import prettier from "prettier";

import prettierConfig from "../../.prettierrc.cjs";

import { fieldsToTypeOrmConfig } from "./utils/fields-to-type-orm-config.js";
import { singularizeWord } from "./utils/singularize-word.js";
import { camelToSnakeCase } from "./utils/camel-to-snake-case.js";
import { formatObjectToCode } from "./utils/format-object-to-code.js";
import { parseFields } from "./utils/parse-fields.js";
import { fieldsToTypeBoxConfig } from "./utils/fields-to-type-box-config.js";
import { generateFieldDefinitions } from "./utils/generateFieldDefinitions.js";
import { generateRouterCode } from "./templates/router.js";
import { generateEntityCode } from "./templates/entity.js";
import { generateSchemasFunction } from "./templates/schemas.js";
import { generateTypesCode } from "./templates/types.js";
import { camelToHyphenCase } from "./utils/camel-to-hyphen-case.js";

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

const createFileFromTemplate = async (folderPath, fileName, content) => {
  await writeFile(path.join(folderPath, fileName), content);
};

const createModuleFiles = async (folderPath, moduleName, fields, isAuthorization) => {
  const LowerCaseName = moduleName;
  const UpperCaseName = moduleName[0].toUpperCase() + LowerCaseName.replace(moduleName[0], "");
  const SchemaName = camelToSnakeCase(moduleName).toUpperCase();

  const attributes = fieldsToTypeOrmConfig(fields, UpperCaseName);

  const values = {
    isAuthorization,
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
    TypeBoxAttributes: fieldsToTypeBoxConfig(fields).entries,
    TypeBoxRequireMessage: fieldsToTypeBoxConfig(fields).errorMessages,
  };

  await createFileFromTemplate(
    folderPath,
    `${singularizeWord(camelToHyphenCase(moduleName))}.entity.js`,
    generateEntityCode(values),
  );
  await createFileFromTemplate(
    folderPath,
    `${camelToHyphenCase(moduleName)}.schemas.js`,
    generateSchemasFunction(values),
  );
  await createFileFromTemplate(
    folderPath,
    `${camelToHyphenCase(moduleName)}.router.v1.js`,
    generateRouterCode(values),
  );
  await createFileFromTemplate(folderPath, `types.d.ts`, generateTypesCode(values));
};

const cyan = "\x1b[36m";
const reset = "\x1b[0m";

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(cyan + query + reset, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
};

const createModule = async () => {
  let isAuthorization = true;
  // let isTests = true;

  const needAuth = await askQuestion("Do you need authorization? (Y/n):");
  if (needAuth.toLowerCase() === "n") {
    isAuthorization = false;
  }

  // const needTests = await askQuestion("Do you need tests? (y/N):");
  // TODO: test generator
  // if (needTests.toLowerCase() === "n") {
  //   isTests = false;
  // }

  const moduleName = getModuleName().charAt(0).toLowerCase() + getModuleName().slice(1);
  const fields = getFieldsFromCliArgs();
  const folderPath = path.join("src", "modules", camelToHyphenCase(moduleName));

  await createFolderStructure(folderPath);
  await createModuleFiles(folderPath, moduleName, fields, isAuthorization);
};

// eslint-disable-next-line no-console
createModule().catch((e) => console.error(e));
