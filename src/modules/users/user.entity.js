import { BaseEntity, EntitySchema } from "typeorm";

import { tables } from "#constants";

export default class User extends BaseEntity {
  /** @type {string} */
  id;

  /** @type {string} */
  firstName;

  /** @type {string} */
  lastName;

  /** @type {string} */
  email;

  /** @type {string} */
  password;

  /** @type {string[]} */
  roles;

  /** @type {string} */
  createdAt;

  /** @type {string} */
  updatedAt;

  /** @type {string | undefined} */
  deletedAt;

  /**
   * Gets the schema for the User class.
   * @return {EntitySchema<User>} The schema for the User class.
   */
  static get schema() {
    return new EntitySchema({
      name: User.name,
      tableName: tables.user,
      columns: {
        id: {
          type: "uuid",
          primary: true,
          generated: "uuid",
        },
        firstName: {
          name: "first_name",
          type: "varchar",
          length: 255,
          nullable: false,
        },
        lastName: {
          name: "last_name",
          type: "varchar",
          length: 255,
          nullable: false,
        },
        email: {
          type: "varchar",
          length: 255,
          nullable: false,
          unique: true,
        },
        password: {
          type: "varchar",
          length: 255,
          nullable: false,
        },
        roles: {
          type: "jsonb",
          default: [],
        },
        createdAt: {
          name: "created_at",
          type: "timestamp",
          default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
          name: "updated_at",
          type: "timestamp",
          default: () => "CURRENT_TIMESTAMP",
        },
        deletedAt: {
          name: "deleted_at",
          type: "timestamp",
          nullable: true,
        },
      },
    });
  }
}
