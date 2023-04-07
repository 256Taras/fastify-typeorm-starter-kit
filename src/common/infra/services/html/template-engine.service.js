import fs from "node:fs";
import mustache from "mustache";
import { VIEWS_PATH } from "#constants";

/**
 * Service for working with HTML templates
 */
export class TemplateEngineService {
  /**
   * Compiles a template with given path and data
   * @param {string} path - Path to the template file
   * @param {Object} data - Data object to use in template rendering
   * @returns {string} - Compiled HTML string
   * @throws {Error} - If the template file does not exist
   */
  compile(path, data = {}) {
    const serverPath = `${VIEWS_PATH}/${path}`;

    if (!fs.existsSync(serverPath)) {
      throw new Error("File not found");
    }

    const html = fs.readFileSync(serverPath, "utf8");

    return mustache.render(html, data);
  }
}
