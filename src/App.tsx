import { useState } from "react";
import { ColorDisplay } from "@/components/ColorDisplay";
import { StepsSlider } from "@/components/StepsSlider";
import { type ColorSpace } from "@/types/color";
import { ColorPairPicker } from "@/components/ColorPairPicker";
import { ColorSpaceSelector } from "@/components/ColorSpaceSelector";
import { useTheme } from "@/hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [startColor, setStartColor] = useState("#0000ff");
  const [endColor, setEndColor] = useState("#ff0000");
  const [steps, setSteps] = useState(10);
  const [colorSpace, setColorSpace] = useState<ColorSpace>("srgb");

  return (
    <div className="bg-background text-foreground mx-auto min-h-screen w-full max-w-[1280px] p-4 text-center font-sans text-sm antialiased">
      <div className="mb-4 flex items-center justify-end">
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

      <h1 className="font-heading mb-9 text-6xl leading-[1.15] font-semibold">
        Color Space Interpolation
      </h1>

      <main>
        <div className="mb-6 flex h-[160px] items-stretch gap-6">
          <ColorDisplay
            startColor={startColor}
            endColor={endColor}
            steps={steps}
            colorSpace={colorSpace}
          />

          <div
            className="border-border bg-surface flex h-full w-[130px] items-center justify-center rounded-[10px] border py-4"
            aria-label="Steps"
          >
            <StepsSlider value={steps} onChange={setSteps} />
          </div>
        </div>

        <div className="flex items-stretch gap-6">
          <ColorPairPicker
            startColor={startColor}
            endColor={endColor}
            onStartChange={setStartColor}
            onEndChange={setEndColor}
          />

          <ColorSpaceSelector value={colorSpace} onChange={setColorSpace} />
        </div>
      </main>
    </div>
  );
}

export default App;
