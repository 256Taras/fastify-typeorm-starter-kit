import path from "path";
import fs from "fs";
// eslint-disable-next-line import/extensions
import { TemplateCreator } from "./template-creator.js";

const CLI_ARG_MODULE_NAME = "name";

/**
 *
 * @param {string} argName
 * @returns
 */
const getCliArgValueByName = (argName) => {
  const allArgs = process.argv;
  const foundArg = allArgs.find((arg) => arg.split("=")[0] === argName);
  if (!foundArg) throw new Error(`Parameter '${argName}' is not found`);
  return foundArg.split("=")[1];
};

const getModuleNameFromCliArgs = () => {
  const moduleName = getCliArgValueByName(CLI_ARG_MODULE_NAME);
  if (!moduleName) throw new Error(`'${CLI_ARG_MODULE_NAME}' has no value`);
  return moduleName;
};

function camelToSnakeCase(camelCaseString) {
  const snakeCaseString = camelCaseString.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
  return snakeCaseString.toUpperCase();
}

function singularizeWord(word) {
  if (word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  } else if (word.endsWith("s")) {
    if (word.endsWith("ss") || word.endsWith("us")) {
      return word.slice(0, -1);
    } else if (word.endsWith("ies")) {
      return word.slice(0, -3) + "y";
    } else if (word.endsWith("ses")) {
      return word.slice(0, -2);
    }
    return word.slice(0, -1);
  }
  return word;
}
/**
 *
 * @param {object} param0
 * @param {string} param0.newModuleName
 * @returns
 */
const createModuleFolderStructure = async ({ newModuleName }) => {
  const modulePath = path.join("src", "modules", newModuleName.toLowerCase());

  const toCamelCase = (srt) =>
    srt.toLowerCase().replace(/([_-][a-z])/g, (g) => g.toUpperCase().replace("-", "").replace("_", ""));

  const LowerCaseName = toCamelCase(newModuleName);
  const UpperCaseName = newModuleName[0].toUpperCase() + LowerCaseName.replace(newModuleName[0], "");
  const ModuleName = newModuleName;
  const SchemaName = camelToSnakeCase(newModuleName);

  const templates = {
    model: "model",
    schemas: "schemas",
    router: "router",
  };

  const fillFile = async (fileName) =>
    TemplateCreator.fillTemplate(await TemplateCreator.getTemplate(fileName), {
      ModuleName,
      ModuleNameSingle: singularizeWord(ModuleName),
      LowerCaseName,
      LowerCaseNameSingle: singularizeWord(LowerCaseName),
      UpperCaseName,
      UpperCaseNameSingle: singularizeWord(UpperCaseName),
      SchemaName,
    });

  // Main folder structure
  // eslint-disable-next-line no-sync
  fs.mkdirSync(modulePath);
  // Handler folder
  // Main folder
  // eslint-disable-next-line no-sync
  fs.writeFileSync(
    path.join(modulePath, `${singularizeWord(ModuleName)}.entity.js`),
    await fillFile(templates.model),
  );
  // eslint-disable-next-line no-sync
  fs.writeFileSync(path.join(modulePath, `${ModuleName}.schemas.js`), await fillFile(templates.schemas));
  // eslint-disable-next-line no-sync
  fs.writeFileSync(path.join(modulePath, `${ModuleName}.router.v1.js`), await fillFile(templates.router));
  // fs.writeFileSync(path.join(modulePath, "create-seed.js"), await fillFile(templates.index));

  return { success: true };
};

const main = async () => {
  // Folder name for module
  const moduleName = getModuleNameFromCliArgs();
  await createModuleFolderStructure({ newModuleName: moduleName });
};

// eslint-disable-next-line no-console
main().catch((e) => console.log(e));
