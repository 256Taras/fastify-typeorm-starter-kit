import { tables } from "#constants";
import { Table } from "typeorm";

/**
 * @typedef {import("typeorm").MigrationInterface} MigrationInterface
 * @typedef {import("typeorm").QueryRunner} QueryRunner
 */
export default class addUser1680654901084 {
  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: tables.user,
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "first_name",
            type: "varchar",
          },
          {
            name: "last_name",
            type: "varchar",
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "roles",
            type: "jsonb",
            default: "'[]'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.dropTable(tables.user);
  }
}
