import React from "react";
import {ChromeColorPicker} from "./ChromeColorPicker";

export type ColorSpace = "srgb" | "hsl" | "hwb" | "lch" | "oklch" | "lab" | "oklab";
export type DisplayMode = "static" | "animation";

interface ControlsProps {
  startColor: string;
  setStartColor: (c: string) => void;
  endColor: string;
  setEndColor: (c: string) => void;
  steps: number;
  setSteps: (s: number) => void;
  colorSpace: ColorSpace;
  setColorSpace: (s: ColorSpace) => void;
}

const COLOR_SPACES: ColorSpace[] = ["srgb", "hsl", "hwb", "lch", "oklch", "lab", "oklab"];

export const Controls: React.FC<ControlsProps> = ({startColor, setStartColor, endColor, setEndColor, steps, setSteps, colorSpace, setColorSpace}) => {
  return (
    <div className="controls">
      <div className="control-group steps-group">
        <label className="steps-label">
          <input className="steps-slider" type="range" min="3" max="50" value={steps} onChange={(e) => setSteps(Number(e.target.value))} aria-label="Steps" />
        </label>
      </div>

      <div className="control-group colors-group">
        <ChromeColorPicker value={startColor} onChange={setStartColor} label="Start" />

        <button
          className="swap-btn"
          onClick={() => {
            const temp = startColor;
            setStartColor(endColor);
            setEndColor(temp);
          }}
          title="Swap Colors"
          aria-label="Swap colors">
          <svg className="swap-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 7h11l-2.8-2.8a1 1 0 0 1 1.4-1.4l4.5 4.5a1 1 0 0 1 0 1.4l-4.5 4.5a1 1 0 0 1-1.4-1.4L18 9H7a1 1 0 1 1 0-2Zm10 10H6l2.8 2.8a1 1 0 0 1-1.4 1.4l-4.5-4.5a1 1 0 0 1 0-1.4l4.5-4.5a1 1 0 0 1 1.4 1.4L6 15h11a1 1 0 1 1 0 2Z" />
          </svg>
        </button>

        <ChromeColorPicker value={endColor} onChange={setEndColor} label="End" />
      </div>
      <div className="control-group color-space-control">
        <fieldset className="color-space-group" aria-label="Color space">
          {COLOR_SPACES.map((space) => (
            <label key={space} className="color-space-option">
              <input type="radio" name="color-space" value={space} checked={colorSpace === space} onChange={() => setColorSpace(space)} />
              <span>{space.toUpperCase()}</span>
            </label>
          ))}
        </fieldset>
        <p className="color-space-hint">Use ↑/↓ or ←/→ to move between options.</p>
      </div>
    </div>
  );
};
