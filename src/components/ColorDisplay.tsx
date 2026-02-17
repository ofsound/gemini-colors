import React from "react";
import type { ColorSpace } from "../types/color";

interface ColorDisplayProps {
  startColor: string;
  endColor: string;
  steps: number;
  colorSpace: ColorSpace;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({
  startColor,
  endColor,
  steps,
  colorSpace,
}) => {
  const blocks = [];
  for (let i = 0; i < steps; i++) {
    const percentage = steps === 1 ? 0 : (i / (steps - 1)) * 100;
    const style = {
      backgroundColor: `color-mix(in ${colorSpace}, ${startColor}, ${endColor} ${percentage}%)`,
    };
    blocks.push(
      <div
        key={i}
        className="relative h-full flex-1 transition-[flex] duration-200 ease-in-out hover:z-1 hover:flex-[1.5] hover:shadow-[0_0_10px_rgba(0,0,0,0.5)] [@media(hover:none),(pointer:coarse)]:hover:flex-1 [@media(hover:none),(pointer:coarse)]:hover:shadow-none"
        style={style}
      ></div>,
    );
  }

  return (
    <div className="bg-surface mb-6 flex h-full min-h-[160px] flex-1 overflow-hidden rounded-[10px]">
      {blocks}
    </div>
  );
};
