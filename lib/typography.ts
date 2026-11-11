const NBSP = " ";
const ONE_LETTER = /(^|[\s(„])([aiouwzAIOUWZ])\s+/g;

/**
 * Polish typesetting: keeps one-letter words (a, i, o, u, w, z) with the following word,
 * so they never hang at the end of a line, and keeps " - " dashes on the previous line.
 */
export function nbsp(text: string): string {
  return text
    .replace(ONE_LETTER, `$1$2${NBSP}`)
    .replace(ONE_LETTER, `$1$2${NBSP}`) // second pass catches chains like "i w domu"
    .replace(/ - /g, `${NBSP}- `);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
