import { ITemplateEngine } from "#services/html/template-engine.interface";

export declare class TemplateEngineService implements ITemplateEngine {
  compile(path: string, data?: Record<string, any>): string;
}
