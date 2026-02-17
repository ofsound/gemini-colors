export const COLOR_SPACES = [
  "srgb",
  "hsl",
  "hwb",
  "lch",
  "oklch",
  "lab",
  "oklab",
] as const;

export type ColorSpace = (typeof COLOR_SPACES)[number];
