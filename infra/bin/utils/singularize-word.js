export function singularizeWord(word) {
  if (word.endsWith("ies")) {
    return word.replace("ies", "y");
  } else if (word.endsWith("es")) {
    return word.slice(0, -2);
  } else if (word.endsWith("s")) {
    return word.slice(0, -1);
  }
  return word;
}
