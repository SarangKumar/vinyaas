/**
 * Suggests registry names for a typo using edit distance and shared prefixes.
 * Catalog-driven — no hardcoded component list.
 */
export function suggestRegistryNames(
  query: string,
  names: readonly string[],
  limit = 3,
): string[] {
  const needle = query.trim().toLowerCase();

  if (needle === "" || names.length === 0) {
    return [];
  }

  const scored = names
    .map((name) => ({
      name,
      score: suggestionScore(needle, name.toLowerCase()),
    }))
    .filter((entry) => entry.score < Number.POSITIVE_INFINITY)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }

      return left.name.localeCompare(right.name);
    });

  const unique: string[] = [];

  for (const entry of scored) {
    if (unique.includes(entry.name)) {
      continue;
    }

    unique.push(entry.name);

    if (unique.length >= limit) {
      break;
    }
  }

  return unique;
}

export function formatUnknownComponentMessage(
  names: readonly string[],
  catalogNames: readonly string[],
): string {
  const unique = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
  const lines: string[] = [];

  if (unique.length === 1) {
    lines.push(`Unknown component: ${unique[0]}`);
  } else {
    lines.push("Unknown component(s):", ...unique.map((name) => `- ${name}`));
  }

  const suggestions = [
    ...new Set(
      unique.flatMap((name) => suggestRegistryNames(name, catalogNames)),
    ),
  ].sort((left, right) => left.localeCompare(right));

  if (suggestions.length > 0) {
    lines.push("", "Did you mean:", ...suggestions.map((name) => `  ${name}`));
  }

  return lines.join("\n");
}

function suggestionScore(query: string, candidate: string): number {
  if (query === candidate) {
    return Number.POSITIVE_INFINITY;
  }

  if (candidate.startsWith(query) || query.startsWith(candidate)) {
    return Math.abs(candidate.length - query.length) * 0.25;
  }

  if (candidate.includes(query)) {
    return 1 + Math.abs(candidate.length - query.length) * 0.25;
  }

  const distance = levenshtein(query, candidate);
  const maxDistance = Math.max(2, Math.floor(query.length / 3));

  if (distance > maxDistance) {
    return Number.POSITIVE_INFINITY;
  }

  return distance;
}

function levenshtein(left: string, right: string): number {
  if (left === right) {
    return 0;
  }

  if (left.length === 0) {
    return right.length;
  }

  if (right.length === 0) {
    return left.length;
  }

  const previous = Array.from(
    { length: right.length + 1 },
    (_, index) => index,
  );
  const current = new Array<number>(right.length + 1);

  for (let i = 1; i <= left.length; i += 1) {
    current[0] = i;

    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      current[j] = Math.min(
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost,
      );
    }

    for (let j = 0; j <= right.length; j += 1) {
      previous[j] = current[j] ?? 0;
    }
  }

  return previous[right.length] ?? right.length;
}
