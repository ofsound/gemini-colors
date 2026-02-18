import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ColorEntity } from "@/components/ColorEntity";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [count, setCount] = useState(1);

  return (
    <div className="bg-background text-foreground mx-auto min-h-screen w-full max-w-4xl p-4 antialiased">
      <div className="mb-[1.4em] flex items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Remove color entity"
            disabled={count <= 1}
            onClick={() => setCount((c) => c - 1)}
            className="border-border bg-surface text-foreground inline-flex size-8 items-center justify-center rounded-md border text-sm font-medium disabled:opacity-40"
          >
            −
          </button>
          <span className="text-foreground min-w-[2ch] text-center text-xs font-medium tabular-nums">
            {count}
          </span>
          <button
            type="button"
            aria-label="Add color entity"
            disabled={count >= 10}
            onClick={() => setCount((c) => c + 1)}
            className="border-border bg-surface text-foreground inline-flex size-8 items-center justify-center rounded-md border text-sm font-medium disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={theme === "dark"}
          aria-label="Toggle dark mode"
          onClick={toggleTheme}
          className="border-border bg-surface text-foreground inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs tracking-wide"
        >
          <span>{theme === "dark" ? "🌙" : "☀️"}</span>
          <span>{theme === "dark" ? "Dark" : "Light"}</span>
        </button>
      </div>

      <h1 className="font-heading mb-[.8em] text-center text-[clamp(1.5rem,0.75rem+3.75vw,3.75rem)] leading-[1.15] font-semibold">
        Color Space Interpolation
      </h1>

      <div className="flex flex-col gap-10">
        {Array.from({ length: count }, (_, i) => (
          <ColorEntity key={i} />
        ))}
      </div>
    </div>
  );
}

export default App;
