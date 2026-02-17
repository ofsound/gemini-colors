import React from "react";

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
  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;
}

const COLOR_SPACES: ColorSpace[] = ["srgb", "hsl", "hwb", "lch", "oklch", "lab", "oklab"];

export const Controls: React.FC<ControlsProps> = ({startColor, setStartColor, endColor, setEndColor, steps, setSteps, colorSpace, setColorSpace, mode, setMode}) => {
  return (
    <div className="controls">
      <div className="control-group mode-toggle">
        <button className={mode === "static" ? "active" : ""} onClick={() => setMode("static")}>
          Static
        </button>
        <button className={mode === "animation" ? "active" : ""} onClick={() => setMode("animation")}>
          Animation
        </button>
      </div>

      <div className="control-group">
        <label>
          <input type="color" value={startColor} onChange={(e) => setStartColor(e.target.value)} />
          {/* <span className="color-value">{startColor}</span> */}
        </label>

        <button
          className="swap-btn"
          onClick={() => {
            const temp = startColor;
            setStartColor(endColor);
            setEndColor(temp);
          }}
          title="Swap Colors">
          ⇄
        </button>

        <label>
          <input type="color" value={endColor} onChange={(e) => setEndColor(e.target.value)} />
          {/* <span className="color-value">{endColor}</span> */}
        </label>
      </div>
      <div className="control-group">
        <div className="control-group color-space-slider">
          <input id="color-space-slider" type="range" min={0} max={COLOR_SPACES.length - 1} step={1} value={COLOR_SPACES.indexOf(colorSpace)} onChange={(e) => setColorSpace(COLOR_SPACES[Number(e.target.value)])} aria-label="Color space" />
          <output className="color-space-label" htmlFor="color-space-slider">
            {colorSpace.toUpperCase()}
          </output>
        </div>
      </div>

      {mode === "static" && (
        <div className="control-group">
          <label>
            Steps&nbsp;({steps})
            <input type="range" min="3" max="50" value={steps} onChange={(e) => setSteps(Number(e.target.value))} />
          </label>
        </div>
      )}
    </div>
  );
};
