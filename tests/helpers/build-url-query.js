import { flow } from "#src/common/utils/functions/index.js";
import { deleteEmptyFields } from "#common/utils/objects/index.js";

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
