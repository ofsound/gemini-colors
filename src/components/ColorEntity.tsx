import { useState } from "react";
import { ColorDisplay } from "@/components/ColorDisplay";
import { StepsSlider } from "@/components/StepsSlider";
import { type ColorSpace } from "@/types/color";
import { ColorPairPicker } from "@/components/ColorPairPicker";
import { ColorSpaceSelector } from "@/components/ColorSpaceSelector";
import { ColorOutput } from "@/components/ColorOutput";

interface ColorEntityProps {
  defaultStartColor?: string;
  defaultEndColor?: string;
  defaultSteps?: number;
  defaultColorSpace?: ColorSpace;
}

export function ColorEntity({
  defaultStartColor = "#0000ff",
  defaultEndColor = "#ff0000",
  defaultSteps = 10,
  defaultColorSpace = "srgb",
}: ColorEntityProps) {
  const [startColor, setStartColor] = useState(defaultStartColor);
  const [endColor, setEndColor] = useState(defaultEndColor);
  const [steps, setSteps] = useState(defaultSteps);
  const [colorSpace, setColorSpace] = useState<ColorSpace>(defaultColorSpace);
  const [selection, setSelection] = useState<{
    color: string;
    index: number;
    key: string;
  } | null>(null);

  const configKey = `${startColor}|${endColor}|${steps}|${colorSpace}`;
  const activeSelection = selection?.key === configKey ? selection : null;

  function handleColorClick(hex: string, index: number) {
    setSelection({ color: hex, index, key: configKey });
  }

  return (
    <section>
      <div className="mb-4 flex h-40 gap-4">
        <ColorDisplay
          startColor={startColor}
          endColor={endColor}
          steps={steps}
          colorSpace={colorSpace}
          onColorClick={handleColorClick}
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

      <ColorOutput
        startColor={startColor}
        endColor={endColor}
        steps={steps}
        colorSpace={colorSpace}
        selectedColor={activeSelection?.color ?? null}
        selectedIndex={activeSelection?.index ?? null}
      />
    </section>
  );
}
