import { camelToSnakeCase } from "./camel-to-snake-case.js";
import { singularizeWord } from "./singularize-word.js";

const getTypeOrmType = (type) => {
  switch (type) {
    case "string":
      return "varchar";
    case "text":
      return "varchar";
    case "integer":
      return "int";
    case "number":
      return "int";
    case "float":
      return "float";
    case "json":
      return "json";
    case "boolean":
      return "boolean";
    case "uuid":
      return "uuid";
    case "date":
      return "date";
    default:
      throw new Error(`Unsupported type '${type}'`);
  }
};

export const fieldsToTypeOrmConfig = (fields, moduleName) => {
  const columns = {};
  const relations = {};

  fields.forEach((field) => {
    const { name, type, size, optional, unique, relatedEntity, relationType, ownerOfRelationship } = field;

    if (relatedEntity && relationType) {
      const relationName = camelToSnakeCase(relatedEntity.charAt(0).toLowerCase() + relatedEntity.slice(1));

      const module = camelToSnakeCase(singularizeWord(moduleName.charAt(0).toLowerCase() + moduleName.slice(1)));

      relations[
        singularizeWord(relatedEntity.charAt(0).toLowerCase() + relatedEntity.slice(1)) +
          (relationType !== "one-to-many" ? "s" : "")
      ] = {
        type: relationType,
        target: relatedEntity,
        ...(!ownerOfRelationship ? { inverseSide: module } : {}),
        ...(relationType === "many-to-one" ? { joinColumn: { name: `${module}_id` } } : {}),
        ...(relationType === "many-to-many" && ownerOfRelationship
          ? {
              joinTable: {
                name: `mtm_${module}_${relationName}`,
                joinColumn: {
                  name: `${module}_id`,
                },
                inverseJoinColumn: {
                  name: `${relationName}_id`,
                },
              },
            }
          : {}),
      };
      if (relationType === "one-to-many" || relationType === "many-to-one") {
        columns[`${relationName}Id`] = {
          type: "uuid",
        };
      }
    } else if (type) {
      const columnName = name.replace(/([A-Z])/g, "_$1").toLowerCase();
      const column = {
        type: getTypeOrmType(type),
        ...(size ? { length: size } : {}),
        ...(unique ? { unique: true } : {}),
        ...(optional ? { nullable: true } : {}),
      };

      if (columnName !== name) {
        // @ts-ignore
        column.name = columnName;
      }

      columns[name] = column;
    }
  });

  return { columns, relations };
};
