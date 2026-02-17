import React, { useEffect, useRef, useState } from "react";
import type { ColorSpace, DisplayMode } from "../types/color";

interface ColorDisplayProps {
  startColor: string;
  endColor: string;
  steps: number;
  colorSpace: ColorSpace;
  mode: DisplayMode;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({
  startColor,
  endColor,
  steps,
  colorSpace,
  mode,
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  const animate = (time: number) => {
    if (startTimeRef.current === undefined) startTimeRef.current = time;
    // const duration = 2000; // 2 seconds per cycle
    const elapsed = time - startTimeRef.current;

    // Ping pong logic
    const cycle = 2000;
    const totalTime = elapsed % (cycle * 2);
    let progress = totalTime / cycle;
    if (progress > 1) progress = 2 - progress;

    setAnimationProgress(progress);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (mode === "animation") {
      startTimeRef.current = undefined;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current !== undefined)
        cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current !== undefined)
        cancelAnimationFrame(requestRef.current);
    };
  }, [mode]);

  if (mode === "animation") {
    const percentage = animationProgress * 100;
    const style = {
      backgroundColor: `color-mix(in ${colorSpace}, ${startColor}, ${endColor} ${percentage}%)`,
    };

    return (
      <div className="mb-6 flex h-full min-h-[160px] items-center justify-center overflow-hidden rounded-[10px] bg-[#1a1a1a] [background-image:linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px] shadow-[0_8px_24px_rgba(0,0,0,0.3)] sm:mb-8 sm:min-h-[180px] sm:rounded-xl md:min-h-[200px]">
        <div
          className="flex size-[clamp(100px,25vw,150px)] items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)]"
          style={style}
        ></div>
      </div>
    );
  }

  // Static Mode
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
    <div className="mb-6 flex h-full min-h-[160px] flex-1 overflow-hidden rounded-[10px] bg-[#1a1a1a] [background-image:linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px] shadow-[0_8px_24px_rgba(0,0,0,0.3)] sm:mb-8 sm:min-h-[180px] sm:rounded-xl md:min-h-[200px]">
      {blocks}
    </div>
  );
};
