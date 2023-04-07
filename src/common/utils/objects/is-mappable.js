export const isMappable = (data) => {
  if (!data) return false;
  if (typeof data !== "object") return false;
  return !Array.isArray(data);
};
