/**
 * Expands short hex (e.g. "abc") to 6 chars ("aabbcc").
 * For 6+ chars, returns first 6 chars (padded with 0 if needed).
 */
export function expandShortHex(hex: string): string {
  const withoutHash = hex.replace("#", "").trim();
  if (withoutHash.length === 3) {
    return withoutHash
      .split("")
      .map((char) => char + char)
      .join("");
  }
  return withoutHash.padEnd(6, "0").slice(0, 6);
}
