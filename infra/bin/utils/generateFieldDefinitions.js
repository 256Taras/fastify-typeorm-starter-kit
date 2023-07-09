export const generateFieldDefinitions = (columns) => {
  const typeOrmTypeToJSDocType = {
    "varchar": "string",
    "int": "number",
    "float": "number",
    "json": "Object",
    "boolean": "boolean",
    "uuid": "string",
    "date": "Date",
  };

  return Object.entries(columns)
    .map(([name, column]) => {
      const jsDocType = typeOrmTypeToJSDocType[column.type] + (column.nullable ? " | null" : "");

      return `
    /** @type {${jsDocType}} */
    ${name};
    `;
    })
    .join("\n");
};
