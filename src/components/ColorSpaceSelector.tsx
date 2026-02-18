import { useRef, type KeyboardEvent } from "react";
import { COLOR_SPACES, type ColorSpace } from "@/types/color";

interface ColorSpaceSelectorProps {
  value: ColorSpace;
  onChange: (value: ColorSpace) => void;
}

export function ColorSpaceSelector({
  value,
  onChange,
}: ColorSpaceSelectorProps) {
  const radioGroupRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    const isArrowKey =
      key === "ArrowDown" ||
      key === "ArrowUp" ||
      key === "ArrowRight" ||
      key === "ArrowLeft";
    const isHomeEnd = key === "Home" || key === "End";

    if (!isArrowKey && !isHomeEnd) return;

    event.preventDefault();

    const currentIndex = COLOR_SPACES.indexOf(value);
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

    onChange(COLOR_SPACES[nextIndex]);

    requestAnimationFrame(() => {
      const radios =
        radioGroupRef.current?.querySelectorAll<HTMLDivElement>(
          '[role="radio"]',
        );
      radios?.[nextIndex]?.focus();
    });
  };

  return (
    <div className="border-border bg-surface flex min-h-[215px] w-[130px] flex-none self-stretch rounded-xl border px-2 py-4">
      <div
        ref={radioGroupRef}
        role="radiogroup"
        aria-label="Color space"
        className="flex h-full w-full flex-col justify-between"
        onKeyDown={handleKeyDown}
      >
        {COLOR_SPACES.map((space, index) => {
          const isSelected = value === space;
          return (
            <div
              key={space}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(space)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onChange(space);
                }
              }}
              data-index={index}
              className="focus-visible:outline-focus/60 flex w-full cursor-pointer items-center justify-start gap-2 px-1 py-0.5 text-sm font-bold tracking-[0.05em] uppercase outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span
                className="border-border bg-background flex size-4 shrink-0 items-center justify-center rounded-full border-2"
                aria-hidden
              >
                {isSelected ? (
                  <span className="bg-foreground size-2 rounded-full" />
                ) : null}
              </span>
              <span
                className={`ml-1 w-max max-w-full rounded-full px-[0.6em] py-[0.1em] ${
                  isSelected
                    ? "bg-neutral-selected-bg text-foreground"
                    : "bg-neutral-bg text-neutral-fg"
                }`}
              >
                {space.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
