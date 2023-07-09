const getTypeOrmType = (type) => {
  switch (type) {
    case "string":
      return "varchar";
    case "integer":
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
  console.log(fields);
  const columns = {};
  const relations = {};

  fields.forEach((field) => {
    const { name, type, size, optional, unique, relatedEntity, relationType, ownerOfRelationship } = field;
    if (relatedEntity && relationType) {
      const relationName = relatedEntity.toLowerCase();
      relations[relationName + (relationType !== "one-to-many" ? "s" : "")] = {
        type: relationType,
        target: relatedEntity,
        ...(!ownerOfRelationship ? { inverseSide: moduleName.toLowerCase() } : {}),
        ...(relationType === "many-to-one" ? { joinColumn: { name: `${relationName}_id` } } : {}),
        ...(relationType === "many-to-many" && ownerOfRelationship
          ? {
              joinTable: {
                name: `mtm_${moduleName.toLowerCase()}_${relatedEntity.toLowerCase()}`,
                joinColumn: {
                  name: `${relationName}_id`,
                  referencedColumnName: "id",
                },
                inverseJoinColumn: {
                  name: `${relatedEntity.toLowerCase()}_id`,
                  referencedColumnName: "id",
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
        column.name = columnName;
      }

      columns[name] = column;
    }
  });

  return { columns, relations };
};
