export const convertToObjectOrEmptyObject = (data) => {
  if (typeof data === "object") return data;
  return {};
};
