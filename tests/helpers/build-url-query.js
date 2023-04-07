import { deleteEmptyFields } from "#utils/objects/index.js";
import { flow } from "#utils/functions/flow.js";
/**
 * Builds a URL query string from an object of key-value pairs. Empty fields will be deleted.
 * @type {function(Record<string, string | Array>): string} An object containing the key-value pairs to include in the query string.
 */
export const buildUrlQuery = flow(
  deleteEmptyFields,
  (query) => new URLSearchParams(query).toString(),
  (params) => params && `?${params}`,
  (params) => decodeURIComponent(params).replace(/,\+/g, ", "),
);
