import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ColorEntity } from "@/components/ColorEntity";
import { randomEntityConfig } from "@/utils/color";
import type { ColorSpace } from "@/types/color";

interface EntityConfig {
  id: number;
  defaultStartColor: string;
  defaultEndColor: string;
  defaultSteps: number;
  defaultColorSpace: ColorSpace;
}

const FIRST_ENTITY: EntityConfig = {
  id: 0,
  defaultStartColor: "#0000ff",
  defaultEndColor: "#ff0000",
  defaultSteps: 10,
  defaultColorSpace: "srgb",
};

let nextId = 1;

function App() {
  const { theme, toggleTheme } = useTheme();
  const [entities, setEntities] = useState<EntityConfig[]>([FIRST_ENTITY]);
  const [exitingId, setExitingId] = useState<number | null>(null);

  function addEntity() {
    setEntities((prev) => [...prev, { id: nextId++, ...randomEntityConfig() }]);
  }

  function removeEntity() {
    if (entities.length <= 1 || exitingId !== null) return;
    setExitingId(entities[entities.length - 1].id);
  }

  function handleExited() {
    setEntities((prev) => prev.filter((e) => e.id !== exitingId));
    setExitingId(null);
  }

  const compact = entities.length > 1;

  return (
    <div className="bg-background text-foreground mx-auto min-h-screen w-full max-w-4xl p-4 antialiased">
      <div className="mb-[1.4em] flex items-center justify-end gap-3">
        <div className="mr-4 flex items-center gap-2">
          <button
            type="button"
            aria-label="Remove color entity"
            disabled={entities.length <= 1 || exitingId !== null}
            onClick={removeEntity}
            className="border-border bg-surface text-foreground inline-flex size-8 items-center justify-center rounded-md border text-sm font-medium disabled:opacity-40"
          >
            −
          </button>
          <span className="text-foreground min-w-[2ch] text-center text-xs font-medium tabular-nums">
            {entities.length}
          </span>
          <button
            type="button"
            aria-label="Add color entity"
            disabled={entities.length >= 10}
            onClick={addEntity}
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

      <div className="flex flex-col">
        {entities
          .slice()
          .reverse()
          .map((e) => (
            <ColorEntity
              key={e.id}
              compact={compact}
              leaving={e.id === exitingId}
              onExited={handleExited}
              defaultStartColor={e.defaultStartColor}
              defaultEndColor={e.defaultEndColor}
              defaultSteps={e.defaultSteps}
              defaultColorSpace={e.defaultColorSpace}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
