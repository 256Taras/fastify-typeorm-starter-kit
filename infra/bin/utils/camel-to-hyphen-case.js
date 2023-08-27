export function camelToHyphenCase(inputString) {
  return inputString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
