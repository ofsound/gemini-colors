import {useState, type KeyboardEvent} from "react";
import {ColorDisplay} from "./components/ColorDisplay";
import type {ColorSpace} from "./types/color";
import {ChromeColorPicker} from "./components/ChromeColorPicker";

const COLOR_SPACES: ColorSpace[] = ["srgb", "hsl", "hwb", "lch", "oklch", "lab", "oklab"];
const STEPS_MIN = 1;
const STEPS_MAX = 50;
const STEPS_SLIDER_PRECISION = 1000;
const STEPS_EXPONENT = 2.45;

const clampNumber = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const stepsFromSliderPosition = (position: number) => {
  const clampedPosition = clampNumber(position, 0, STEPS_SLIDER_PRECISION);
  const normalizedPosition = clampedPosition / STEPS_SLIDER_PRECISION;
  const curved = Math.pow(normalizedPosition, STEPS_EXPONENT);
  const mapped = STEPS_MIN + (STEPS_MAX - STEPS_MIN) * curved;
  return Math.round(mapped);
};

const sliderPositionFromSteps = (steps: number) => {
  const clampedSteps = clampNumber(steps, STEPS_MIN, STEPS_MAX);
  const normalizedSteps = (clampedSteps - STEPS_MIN) / (STEPS_MAX - STEPS_MIN);
  const inverseCurved = Math.pow(normalizedSteps, 1 / STEPS_EXPONENT);
  return Math.round(inverseCurved * STEPS_SLIDER_PRECISION);
};

function App() {
  const [startColor, setStartColor] = useState("#0000ff");
  const [endColor, setEndColor] = useState("#ff0000");
  const [steps, setSteps] = useState(10);
  const [colorSpace, setColorSpace] = useState<ColorSpace>("srgb");
  const sliderPosition = sliderPositionFromSteps(steps);

  const handleColorSpaceKeyDown = (currentIndex: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    const {key} = event;
    const isArrowKey = key === "ArrowDown" || key === "ArrowUp" || key === "ArrowRight" || key === "ArrowLeft";
    const isHomeEnd = key === "Home" || key === "End";

    if (!isArrowKey && !isHomeEnd) return;

    event.preventDefault();

    let nextIndex = currentIndex;

    if (key === "ArrowDown" || key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % COLOR_SPACES.length;
    }

    if (key === "ArrowUp" || key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + COLOR_SPACES.length) % COLOR_SPACES.length;
    }

    if (key === "Home") nextIndex = 0;
    if (key === "End") nextIndex = COLOR_SPACES.length - 1;

    const nextValue = COLOR_SPACES[nextIndex];
    setColorSpace(nextValue);

    requestAnimationFrame(() => {
      const nextRadio = document.querySelector<HTMLInputElement>(`input[name="color-space"][value="${nextValue}"]`);
      nextRadio?.focus();
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Color Space Interpolation</h1>
      </header>

      <main>
        <div className="display-with-steps">
          <ColorDisplay startColor={startColor} endColor={endColor} steps={steps} colorSpace={colorSpace} mode="static" />

          <div className="vertical-steps-wrap" aria-label="Steps">
            <input
              className="steps-slider-vertical"
              type="range"
              min="0"
              max={STEPS_SLIDER_PRECISION}
              step="1"
              value={sliderPosition}
              onChange={(e) => setSteps(stepsFromSliderPosition(Number(e.target.value)))}
              aria-label="Steps"
            />
          </div>
        </div>

        <div className="controls-with-color-space">
          <div className="controls">
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

              <ChromeColorPicker value={endColor} onChange={setEndColor} label="End" reverseTopRow />
            </div>
          </div>

          <div className="display-color-space-wrap controls-color-space-wrap">
            <fieldset className="color-space-group color-space-group-vertical" aria-label="Color space">
              {COLOR_SPACES.map((space) => (
                <label key={space} className="color-space-option">
                  <input type="radio" name="color-space" value={space} checked={colorSpace === space} onChange={() => setColorSpace(space)} onKeyDown={handleColorSpaceKeyDown(COLOR_SPACES.indexOf(space))} />
                  <span>{space.toUpperCase()}</span>
                </label>
              ))}
            </fieldset>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
