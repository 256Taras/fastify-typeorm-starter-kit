/**
 *
 * @param {Object} obj
 */
export const deleteEmptyFields = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
