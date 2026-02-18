import type { ColorSpace } from "@/types/color";
import { COLOR_SPACES } from "@/types/color";

/** Returns a random full 6-digit hex color string. */
function randomHex(): string {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}

/** Returns a randomized set of ColorEntity default props. */
export function randomEntityConfig() {
  return {
    defaultStartColor: randomHex(),
    defaultEndColor: randomHex(),
    // Steps: uniform random between 2 and 50
    defaultSteps: Math.floor(Math.random() * 49) + 2,
    defaultColorSpace:
      COLOR_SPACES[Math.floor(Math.random() * COLOR_SPACES.length)],
  };
}

/**
 * Resolves all interpolated color-mix() steps to their actual #rrggbb hex values
 * by painting each color onto an offscreen 1×1 canvas and reading back the pixel.
 * Mirrors the same percentage math used in ColorDisplay.
 */
export function resolveColorMix(
  startColor: string,
  endColor: string,
  steps: number,
  colorSpace: ColorSpace,
): string[] {
  const canvas = new OffscreenCanvas(1, 1);
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  return Array.from({ length: steps }, (_, i) => {
    const percentage = steps === 1 ? 0 : (i / (steps - 1)) * 100;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = `color-mix(in ${colorSpace}, ${startColor}, ${endColor} ${percentage}%)`;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return (
      "#" +
      [r, g, b]
        .map((c) => c.toString(16).padStart(2, "0").toUpperCase())
        .join("")
    );
  });
}

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
