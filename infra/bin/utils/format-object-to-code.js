export function formatObjectToCode(obj, level = 1, isTopLevel = true) {
  const padding = "   ".repeat(level);
  const entries = Object.entries(obj).map(([key, value]) => {
    let formattedValue;
    if (typeof value === "string") {
      formattedValue = `'${value}'`;
    } else if (typeof value === "object") {
      formattedValue = formatObjectToCode(value, level + 1, false);
    } else if (typeof value === "number") {
      formattedValue = value; // If the value is a number, just use it directly
    } else {
      formattedValue = value;
    }
    return `${padding}${key}: ${formattedValue},`;
  });
  return isTopLevel ? entries.join("\n") : `{\n${entries.join("\n")}\n${padding.slice(2)}}`;
}
