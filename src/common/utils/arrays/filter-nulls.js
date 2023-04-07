/**
 * A function that filters out null values from an array.
 * @template T T
 * @param {(T | null)[]} array
 * @returns {T[]}
 */
export const filterNulls = (array) => {
  const nonNullItems = [];
  array.forEach((element) => {
    if (element !== null) {
      nonNullItems.push(element);
    }
  });
  return nonNullItems;
};
