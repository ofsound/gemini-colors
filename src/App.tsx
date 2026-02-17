import { useState, type KeyboardEvent } from "react";
import { ColorDisplay } from "./components/ColorDisplay";
import { StepsSlider } from "./components/StepsSlider";
import type { ColorSpace } from "./types/color";
import { ChromeColorPicker } from "./components/ChromeColorPicker";
import { useTheme } from "@/components/ThemeProvider";

const COLOR_SPACES: ColorSpace[] = [
  "srgb",
  "hsl",
  "hwb",
  "lch",
  "oklch",
  "lab",
  "oklab",
];

function App() {
  const { theme, toggleTheme } = useTheme();
  const [startColor, setStartColor] = useState("#0000ff");
  const [endColor, setEndColor] = useState("#ff0000");
  const [steps, setSteps] = useState(10);
  const [colorSpace, setColorSpace] = useState<ColorSpace>("srgb");

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
    <div className="bg-background text-foreground mx-auto min-h-screen w-full max-w-[1280px] p-4 text-center font-sans text-sm antialiased sm:p-5 md:p-6 lg:p-8">
      <header>
        <div className="mb-4 flex items-center justify-end">
          <button
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="border-border bg-surface text-foreground hover:bg-surface-hover inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            <span>{theme === "dark" ? "🌙" : "☀️"}</span>
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
        </div>

        <h1 className="mb-9 [font-family:'Rubik'] text-6xl leading-[1.15] font-normal">
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
            className="border-border bg-surface flex h-full w-[130px] items-center justify-center rounded-[10px] border"
            aria-label="Steps"
          >
            <StepsSlider value={steps} onChange={setSteps} />
          </div>
        </div>

        <div className="flex items-stretch gap-6">
          <div className="border-border bg-surface mt-0 flex min-w-0 flex-1 flex-col gap-12 rounded-xl border px-4 pt-8 pb-2 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
            <div className="mb-[30px] flex flex-nowrap items-start justify-start gap-4">
              <ChromeColorPicker
                value={startColor}
                onChange={setStartColor}
                label="Start"
              />

              <button
                className="border-border bg-button-primary text-button-primary-fg hover:border-border-strong hover:bg-button-primary-hover focus-visible:outline-focus/60 mt-18 min-h-[42px] min-w-[52px] self-start rounded-[10px] border px-3 py-3 align-top text-lg font-bold transition-[background,border-color,box-shadow] duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.24),0_1px_3px_rgba(0,0,0,0.2)]"
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

          <div className="border-border bg-surface flex min-h-[215px] w-[130px] flex-none self-stretch rounded-[10px] border px-2 py-2 pt-10">
            <fieldset
              className="m-0 flex w-full flex-col gap-1 border-0 p-0"
              aria-label="Color space"
            >
              {COLOR_SPACES.map((space) => (
                <label
                  key={space}
                  className="flex w-full items-center justify-start gap-2 px-1 py-0.5 text-sm font-bold tracking-[0.05em] uppercase"
                >
                  <input
                    className="peer accent-foreground focus-visible:outline-focus/60 m-0 scale-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                    type="radio"
                    name="color-space"
                    value={space}
                    checked={colorSpace === space}
                    onChange={() => setColorSpace(space)}
                    onKeyDown={handleColorSpaceKeyDown(
                      COLOR_SPACES.indexOf(space),
                    )}
                  />
                  <span className="bg-neutral-bg text-neutral-fg peer-checked:bg-border peer-checked:text-foreground inline-flex w-max max-w-full items-center justify-center rounded-full px-[0.4em] py-[0.1em]">
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
