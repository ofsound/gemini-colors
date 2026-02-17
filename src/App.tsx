import { useState, type KeyboardEvent } from "react";
import { ColorDisplay } from "./components/ColorDisplay";
import type { ColorSpace } from "./types/color";
import { ChromeColorPicker } from "./components/ChromeColorPicker";

const COLOR_SPACES: ColorSpace[] = [
  "srgb",
  "hsl",
  "hwb",
  "lch",
  "oklch",
  "lab",
  "oklab",
];
const STEPS_MIN = 1;
const STEPS_MAX = 50;
const STEPS_SLIDER_PRECISION = 1000;
const STEPS_EXPONENT = 2.45;

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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

  const handleColorSpaceKeyDown =
    (currentIndex: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      const isArrowKey =
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "ArrowRight" ||
        key === "ArrowLeft";
      const isHomeEnd = key === "Home" || key === "End";

      if (!isArrowKey && !isHomeEnd) return;

      event.preventDefault();

      let nextIndex = currentIndex;

      if (key === "ArrowDown" || key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % COLOR_SPACES.length;
      }

      if (key === "ArrowUp" || key === "ArrowLeft") {
        nextIndex =
          (currentIndex - 1 + COLOR_SPACES.length) % COLOR_SPACES.length;
      }

      if (key === "Home") nextIndex = 0;
      if (key === "End") nextIndex = COLOR_SPACES.length - 1;

      const nextValue = COLOR_SPACES[nextIndex];
      setColorSpace(nextValue);

      requestAnimationFrame(() => {
        const nextRadio = document.querySelector<HTMLInputElement>(
          `input[name="color-space"][value="${nextValue}"]`,
        );
        nextRadio?.focus();
      });
    };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1280px] bg-[#131212] p-4 text-center [font-family:'Ubuntu'] [font-size:clamp(0.8rem,0.7rem+0.25vw,1.1rem)] text-white antialiased sm:p-5 md:p-6 lg:p-8">
      <header>
        <h1 className="mb-[2.2rem] [font-family:'Rubik'] text-[3.6rem] leading-[1.15] font-normal">
          Color Space Interpolation
        </h1>
      </header>

      <main>
        <div className="mb-6 flex h-[160px] items-stretch gap-6 sm:h-[180px] md:h-[200px]">
          <ColorDisplay
            startColor={startColor}
            endColor={endColor}
            steps={steps}
            colorSpace={colorSpace}
            mode="static"
          />

          <div
            className="flex h-full w-[130px] items-center justify-center rounded-[10px] bg-[#333]"
            aria-label="Steps"
          >
            <input
              className="m-[10%_0] h-[80%] min-h-0 w-[34px] min-w-[140px] cursor-ns-resize appearance-none bg-transparent [direction:rtl] [writing-mode:vertical-lr] focus-visible:outline-none [&::-moz-range-thumb]:h-[46px] [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-lg [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.35)] focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,0.35)] [&::-moz-range-track]:w-3 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:bg-linear-to-b [&::-moz-range-track]:from-white/15 [&::-moz-range-track]:to-white/35 [&::-webkit-slider-runnable-track]:w-3 [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-linear-to-b [&::-webkit-slider-runnable-track]:from-white/15 [&::-webkit-slider-runnable-track]:to-white/35 [&::-webkit-slider-thumb]:-ml-2 [&::-webkit-slider-thumb]:h-[46px] [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-lg [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.35)] focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,0.35)]"
              type="range"
              min="0"
              max={STEPS_SLIDER_PRECISION}
              step="1"
              value={sliderPosition}
              onChange={(e) =>
                setSteps(stepsFromSliderPosition(Number(e.target.value)))
              }
              aria-label="Steps"
            />
          </div>
        </div>

        <div className="flex items-stretch gap-6">
          <div className="mt-0 flex min-w-0 flex-1 flex-col gap-12 rounded-xl bg-[#333] px-4 pt-8 pb-2 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
            <div className="mb-[30px] flex flex-nowrap items-start justify-start gap-2">
              <ChromeColorPicker
                value={startColor}
                onChange={setStartColor}
                label="Start"
              />

              <button
                className="mx-1 min-h-[42px] min-w-[52px] self-center rounded-[10px] border border-[#2f2f2f] bg-linear-to-b from-[#6a6a6a] via-[#4a4a4a] to-[#3b3b3b] px-[0.8rem] py-[0.45rem] text-[1.1rem] font-bold text-white transition-[background,border-color,box-shadow] duration-200 ease-in-out hover:border-[#3b3b3b] hover:bg-linear-to-b hover:from-[#757575] hover:via-[#565656] hover:to-[#474747] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.26)]"
                onClick={() => {
                  const temp = startColor;
                  setStartColor(endColor);
                  setEndColor(temp);
                }}
                title="Swap Colors"
                aria-label="Swap colors"
              >
                <svg
                  className="block size-7 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M7 7h11l-2.8-2.8a1 1 0 0 1 1.4-1.4l4.5 4.5a1 1 0 0 1 0 1.4l-4.5 4.5a1 1 0 0 1-1.4-1.4L18 9H7a1 1 0 1 1 0-2Zm10 10H6l2.8 2.8a1 1 0 0 1-1.4 1.4l-4.5-4.5a1 1 0 0 1 0-1.4l4.5-4.5a1 1 0 0 1 1.4 1.4L6 15h11a1 1 0 1 1 0 2Z" />
                </svg>
              </button>

              <ChromeColorPicker
                value={endColor}
                onChange={setEndColor}
                label="End"
                reverseTopRow
              />
            </div>
          </div>

          <div className="flex min-h-[215px] w-[130px] flex-none self-stretch rounded-[10px] bg-[#333] px-[0.45rem] py-2">
            <fieldset
              className="m-0 flex w-full flex-col gap-[0.3rem] border-0 p-0"
              aria-label="Color space"
            >
              {COLOR_SPACES.map((space) => (
                <label
                  key={space}
                  className="flex w-full items-center justify-start gap-2 px-[0.2rem] py-[0.15rem] text-[0.9rem] font-bold tracking-[0.05em] uppercase"
                >
                  <input
                    className="peer m-0 scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45"
                    type="radio"
                    name="color-space"
                    value={space}
                    checked={colorSpace === space}
                    onChange={() => setColorSpace(space)}
                    onKeyDown={handleColorSpaceKeyDown(
                      COLOR_SPACES.indexOf(space),
                    )}
                  />
                  <span className="inline-flex w-max max-w-full items-center justify-center rounded-full bg-white/15 px-[0.4em] py-[0.1em] peer-checked:bg-white/25">
                    {space.toUpperCase()}
                  </span>
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
