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
   * @returns {Promise<string>} - Compiled HTML string
   * @throws {Error} - If the template file does not exist
   */
  async compile(path, data = {}) {
    const serverPath = `${VIEWS_PATH}/${path}`;

    try {
      await fs.promises.access(serverPath, fs.constants.R_OK);
      const html = await fs.promises.readFile(serverPath, "utf8");
      return mustache.render(html, data);
    } catch (err) {
      throw new Error("File not found");
    }
  }
}
