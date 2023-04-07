import { Table } from "typeorm";
import { tables } from "#constants";

/**
 * @typedef {import("typeorm").MigrationInterface} MigrationInterface
 * @typedef {import("typeorm").QueryRunner} QueryRunner
 */
export default class addAuthToken1680655186721 {
  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: "auth_token",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "ppid",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.dropTable(tables.authToken);
  }
}

/**
 *  foreignKeys: [
 *           {
 *             columnNames: ["user_id"],
 *             referencedColumnNames: ["id"],
 *             referencedTableName: "user",
 *             onDelete: "CASCADE",
 *           },
 *         ],
 */
