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

  const templates = {
    model: "model",
    create: "create",
    get: "get",
    getOne: "get-one",
    update: "update",
    delete: "delete",
    schemas: "schemas",
    index: "index",
    router: "router",
  };

  const fillFile = async (fileName) =>
    TemplateCreator.fillTemplate(await TemplateCreator.getTemplate(fileName), {
      ModuleName,
      LowerCaseName,
      UpperCaseName,
    });

  // Main folder structure
  fs.mkdirSync(modulePath);
  // Handler folder
  fs.mkdirSync(path.join(modulePath, "use-cases"));
  fs.writeFileSync(
    path.join(modulePath, `use-cases/create-${ModuleName}.use-case.js`),
    await fillFile(templates.create),
  );
  fs.writeFileSync(
    path.join(modulePath, `use-cases/get-${ModuleName}.use-case.js`),
    await fillFile(templates.get),
  );
  fs.writeFileSync(
    path.join(modulePath, `use-cases/get-one-${ModuleName}.use-case.js`),
    await fillFile(templates.getOne),
  );
  fs.writeFileSync(
    path.join(modulePath, `use-cases/update-${ModuleName}.use-case.js`),
    await fillFile(templates.update),
  );
  fs.writeFileSync(
    path.join(modulePath, `use-cases/delete-${ModuleName}.handler.js`),
    await fillFile(templates.delete),
  );
  // Main folder
  fs.writeFileSync(path.join(modulePath, `${ModuleName}.model.js`), await fillFile(templates.model));
  fs.writeFileSync(path.join(modulePath, `${ModuleName}.schemas.js`), await fillFile(templates.schemas));
  fs.writeFileSync(path.join(modulePath, `${ModuleName}.router.v1.js`), await fillFile(templates.router));
  fs.writeFileSync(path.join(modulePath, "create-seed.js"), await fillFile(templates.index));

  return { success: true };
};

const main = async () => {
  // Folder name for module
  const moduleName = getModuleNameFromCliArgs();
  await createModuleFolderStructure({ newModuleName: moduleName });
};

main();
