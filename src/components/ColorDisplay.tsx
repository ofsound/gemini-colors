import React, {useEffect, useRef, useState} from "react";
import type {ColorSpace, DisplayMode} from "../types/color";

interface ColorDisplayProps {
  startColor: string;
  endColor: string;
  steps: number;
  colorSpace: ColorSpace;
  mode: DisplayMode;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({startColor, endColor, steps, colorSpace, mode}) => {
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
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);
    };
  }, [mode]);

  if (mode === "animation") {
    const percentage = animationProgress * 100;
    const style = {
      backgroundColor: `color-mix(in ${colorSpace}, ${startColor}, ${endColor} ${percentage}%)`,
    };

    return (
      <div className="display-container animation-mode">
        <div className="color-box animated" style={style}></div>
      </div>
    );
  }

  // Static Mode
  const blocks = [];
  for (let i = 0; i < steps; i++) {
    const percentage = (i / (steps - 1)) * 100;
    const style = {
      backgroundColor: `color-mix(in ${colorSpace}, ${startColor}, ${endColor} ${percentage}%)`,
    };
    blocks.push(<div key={i} className="color-box" style={style}></div>);
  }

  return <div className="display-container static-mode">{blocks}</div>;
};
