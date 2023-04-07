import { BaseEntity, EntitySchema } from "typeorm";
import { tables } from "#constants";

/**
 * @typedef {import('./types.d').IUser} IUser
 */

export default class User extends BaseEntity {
  /**
   * Creates a new instance of the User class.
   * @constructor
   * @param {import('#types/common/utility-types').PartialBy<IUser, 'deletedAt' | 'updatedAt' | 'createdAt'>} dto
   */
  constructor({ id, firstName, lastName, email, password, roles, createdAt, updatedAt, deletedAt }) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
    this.deletedAt = deletedAt;
  }

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
