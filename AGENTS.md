# Gemini Colors – Agent Guidelines

## Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS v4** via `@tailwindcss/vite`
- Path alias `@/` → `src/`

## Structure

- `src/components/` – React components
- `src/context/` – React context (e.g. `ThemeContext`)
- `src/hooks/` – Custom hooks (e.g. `useTheme`)
- `src/types/` – Shared types and constants (e.g. `ColorSpace`, `COLOR_SPACES`)
- `src/utils/` – Pure utility functions (e.g. `clamp`, `expandShortHex`)

## Conventions

- Use `@/` for imports (e.g. `import { clamp } from "@/utils/clamp"`).
- Use existing types from `@/types/color` (`ColorSpace`, `COLOR_SPACES`) rather than redefining.
- Prefer Tailwind classes over inline styles; use inline `style` only for dynamic values (e.g. color, size from props).
- Theme: `ThemeProvider` wraps the app; use `useTheme()` for `theme` and `toggleTheme`.

## What This App Does

Color space interpolation tool. Users pick start/end colors, choose a color space (srgb, hsl, hwb, lch, oklch, lab, oklab), and view interpolated steps via CSS `color-mix()`.

## Tooling

- ESLint for linting
- Prettier for formatting (Tailwind plugin)
- Knip for unused code/dependencies
