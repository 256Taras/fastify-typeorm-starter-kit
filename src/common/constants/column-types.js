/**
 *
 * @type {Record<string, import('typeorm').ColumnType>}
 * */
export const COLUMN_TYPES = {
  int: "integer",
  bigint: "bigint",
  float: "float",
  double: "double precision",
  decimal: "decimal",
  char: "char",
  varchar: "varchar",
  text: "text",
  boolean: "boolean",
  date: "date",
  time: "time",
  datetime: "timestamp",
  json: "json",
  jsonb: "jsonb",
  uuid: "uuid",
  inet: "inet",
};

/**
 * @param {string} values
 * @return {string}
 */
export const enums = (values) => `enum('${values.join("', '")}')`;
/**
 * @param {string}type
 * @return {`${string}[]`}
 */
export const array = (type) => `${type}[]`;
