import { BaseEntity, EntitySchema } from "typeorm";
import User from "#modules/users/user.entity.js";
import { tables } from "#constants";

export default class AuthToken extends BaseEntity {
  /**
   * Creates a new instance of the AuthToken class.
   * @constructor
   * @param {object} params - The parameters to create the AuthToken
   * @param {string} params.id - The unique identifier of the AuthToken
   * @param {string} params.ppid - The unique identifier of the user AuthToken.
   * @param {string} params.userId - The unique identifier of the user.
   * @param {string} params.createdAt - The date and time the user's AuthToken was created, in ISO format.
   */
  constructor({ id, ppid, userId, createdAt }) {
    super();
    this.id = id;
    this.ppid = ppid;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  /**
   * @type {import("typeorm").EntitySchema<AuthToken>}
   */
  static get schema() {
    return new EntitySchema({
      name: "AuthToken",
      tableName: tables.authToken,
      columns: {
        id: {
          type: "uuid",
          primary: true,
          generated: "uuid",
          nullable: false,
          comment: "Token ID",
        },
        ppid: {
          type: "varchar",
          length: 255,
          nullable: false,
          comment: "PPID",
        },
        userId: {
          type: "uuid",
          nullable: false,
          comment: "User ID",
          name: "user_id",
        },
        createdAt: {
          name: "created_at",
          type: "timestamp",
          default: () => "CURRENT_TIMESTAMP",
          nullable: false,
          comment: "Timestamp of creation",
        },
      },
      relations: {
        // @ts-ignore
        user: {
          type: "many-to-one",
          target: User.name,
          joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
          },
          onDelete: "CASCADE",
        },
      },
    });
  }
}
