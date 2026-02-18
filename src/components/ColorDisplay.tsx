import type { ColorSpace } from "@/types/color";
import { resolveColorMix } from "@/utils/color";

interface ColorDisplayProps {
  startColor: string;
  endColor: string;
  steps: number;
  colorSpace: ColorSpace;
  onColorClick?: (hex: string, index: number) => void;
}

export function ColorDisplay({
  startColor,
  endColor,
  steps,
  colorSpace,
  onColorClick,
}: ColorDisplayProps) {
  const blocks = [];
  for (let i = 0; i < steps; i++) {
    const percentage = steps === 1 ? 0 : (i / (steps - 1)) * 100;
    const style = {
      backgroundColor: `color-mix(in ${colorSpace}, ${startColor}, ${endColor} ${percentage}%)`,
    };
    blocks.push(
      <div
        key={i}
        className={`relative h-full flex-1 transition-[flex] duration-200 ease-in-out hover:z-1 hover:flex-[1.5] hover:shadow-[0_0_10px_rgba(0,0,0,0.5)] [@media(hover:none),(pointer:coarse)]:hover:flex-1 [@media(hover:none),(pointer:coarse)]:hover:shadow-none${onColorClick ? "cursor-pointer" : ""}`}
        style={style}
        onClick={
          onColorClick
            ? () => {
                const hex = resolveColorMix(
                  startColor,
                  endColor,
                  steps,
                  colorSpace,
                )[i];
                if (hex) onColorClick(hex, i + 1);
              }
            : undefined
        }
      ></div>,
    );
  }

  return (
    <div className="bg-surface relative mb-6 flex h-full min-h-[160px] flex-1 overflow-hidden rounded-[10px]">
      {blocks}
      <div className="pointer-events-none absolute top-2 right-2 z-20 rounded-[4px] bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
        {steps}
      </div>
    </div>
  );
}
