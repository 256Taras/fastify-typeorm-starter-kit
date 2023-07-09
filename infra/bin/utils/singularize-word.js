export function singularizeWord(word) {
  if (word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  } else if (word.endsWith("s")) {
    if (word.endsWith("ss") || word.endsWith("us")) {
      return word.slice(0, -1);
    } else if (word.endsWith("ies")) {
      return word.slice(0, -3) + "y";
    } else if (word.endsWith("ses")) {
      return word.slice(0, -2);
    }
    return word.slice(0, -1);
  }
  return word;
}
