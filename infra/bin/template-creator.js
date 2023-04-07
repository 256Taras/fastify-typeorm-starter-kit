import url from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

export class TemplateCreator {
  static getTemplate(name) {
    const dirname = url.fileURLToPath(new URL(".", import.meta.url));
    const pathToEmail = path.resolve(dirname, `./templates/${name}`);
    return fs.readFile(pathToEmail, "utf-8");
  }

  static fillTemplate(template, fillData) {
    Object.entries(fillData).forEach(([key, value]) => {
      // eslint-disable-next-line no-param-reassign
      template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    return template;
  }
}
