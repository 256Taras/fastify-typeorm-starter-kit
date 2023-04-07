import { Logger, QueryRunner } from "typeorm";
export declare class DatabaseLoggerService implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void;
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): void;
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void;
  logSchemaBuild(message: string, queryRunner?: QueryRunner): void;
  logMigration(message: string, queryRunner?: QueryRunner): void;
  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): void;
}
