import { BaseEntity, EntitySchema } from "typeorm";

import User from "#modules/users/user.entity.js";
import { tables } from "#common/constants/index.js";

export default class AuthToken extends BaseEntity {
  /** @type {string} */
  id;
  /** @type {string} */
  ppid;
  /** @type {string} */
  userId;
  /** @type {string} */
  createdAt;

  /** @type {import("typeorm").EntitySchema<AuthToken>} */
  static get schema() {
    return new EntitySchema({
      name: AuthToken.name,
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
