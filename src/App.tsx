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
    <div className="bg-background text-foreground mx-auto min-h-screen w-full max-w-4xl p-4 antialiased">
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

      <h1 className="font-heading mb-9 text-center font-semibold leading-[1.15] text-[clamp(1.5rem,0.75rem+3.75vw,3.75rem)]">
        Color Space Interpolation
      </h1>

      <main>
        <div className="mb-4 flex h-40 gap-4">
          <ColorDisplay
            startColor={startColor}
            endColor={endColor}
            steps={steps}
            colorSpace={colorSpace}
          />
          <StepsSlider value={steps} onChange={setSteps} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-row-reverse">
          <ColorSpaceSelector value={colorSpace} onChange={setColorSpace} />
          <ColorPairPicker
            startColor={startColor}
            endColor={endColor}
            onStartChange={setStartColor}
            onEndChange={setEndColor}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
