export function parseJsonConfig(source: string): unknown {
  try {
    return JSON.parse(source) as unknown;
  } catch {
    return JSON.parse(stripJsonComments(source).replace(/,\s*([}\]])/g, "$1"));
  }
}

function stripJsonComments(source: string): string {
  let result = "";
  let inString = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inString) {
      result += char;

      if (char === "\\") {
        result += next ?? "";
        index += 1;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }

    if (char === "/" && next === "/") {
      index += 1;

      while (index + 1 < source.length && source[index + 1] !== "\n") {
        index += 1;
      }

      continue;
    }

    if (char === "/" && next === "*") {
      index += 2;

      while (
        index < source.length &&
        !(source[index] === "*" && source[index + 1] === "/")
      ) {
        index += 1;
      }

      index += 1;
      continue;
    }

    result += char;
  }

  return result;
}
