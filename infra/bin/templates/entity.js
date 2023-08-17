export function generateEntityCode({
  UpperCaseNameSingle,
  EntityFields,
  LowerCaseNameSingle,
  EntityAttributes,
  EntityRelations,
}) {
  return `
import { BaseEntity, EntitySchema } from "typeorm";

export default class ${UpperCaseNameSingle} extends BaseEntity {

  /** @type {string} */
  id;

  ${EntityFields}

  /** @type {string} */
  createdAt;

  /** @type {string} */
  updatedAt;

  static get schema() {
    return new EntitySchema({
      name: ${UpperCaseNameSingle}.name,
      tableName: "${LowerCaseNameSingle}",
      columns: {
        id: {
          type: "uuid",
          primary: true,
          generated: "uuid",
        },
        ${EntityAttributes}
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
      },
      relations: {
        // @ts-ignore
        ${EntityRelations}
      },
    });
  }
}
`;
}
