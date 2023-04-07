/**
 * Interface for a template engine service that compiles templates.
 */
export interface ITemplateEngine {
  /**
   * Compiles a template located at the specified path using the provided data.
   * @param path - The path to the template file.
   * @param data - Optional. An object containing data to be used in the template.
   * @returns The compiled template as a string.
   */
  compile(path: string, data?: Record<string, any>): string;
}
