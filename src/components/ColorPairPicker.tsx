import { useCallback } from "react";
import { ChromeColorPicker } from "@/components/ChromeColorPicker";

interface ColorPairPickerProps {
  startColor: string;
  endColor: string;
  onStartChange: (color: string) => void;
  onEndChange: (color: string) => void;
}

export function ColorPairPicker({
  startColor,
  endColor,
  onStartChange,
  onEndChange,
}: ColorPairPickerProps) {
  const handleSwap = useCallback(() => {
    onStartChange(endColor);
    onEndChange(startColor);
  }, [startColor, endColor, onStartChange, onEndChange]);

  return (
    <div className="border-border bg-surface flex min-w-0 justify-between gap-[clamp(.8rem,4vw,3rem)] rounded-xl border px-4 py-4">
      <ChromeColorPicker
        value={startColor}
        onChange={onStartChange}
        label="Start"
      />

      <button
        className="border-border bg-button-primary-bg text-button-primary-fg hover:border-border-strong hover:bg-button-primary-bg-hover focus-visible:outline-focus/60 mt-16 flex size-9.5 items-center justify-center rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.24),0_1px_3px_rgba(0,0,0,0.2)]"
        onClick={handleSwap}
        title="Swap Colors"
        aria-label="Swap colors"
      >
        <svg
          className="size-5 fill-current stroke-current"
          viewBox="0 0 24 28"
          aria-hidden="true"
          focusable="false"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M7 5h11l-2.8-2.8a1 1 0 0 1 1.4-1.4l4.5 4.5a1 1 0 0 1 0 1.4l-4.5 4.5a1 1 0 0 1-1.4-1.4L18 7H7a1 1 0 1 1 0-2Z" />
          <g transform="translate(0, 6)">
            <path d="M17 17H6l2.8 2.8a1 1 0 0 1-1.4 1.4l-4.5-4.5a1 1 0 0 1 0-1.4l4.5-4.5a1 1 0 0 1 1.4 1.4L6 15h11a1 1 0 1 1 0 2Z" />
          </g>
        </svg>
      </button>

      <ChromeColorPicker
        value={endColor}
        onChange={onEndChange}
        label="End"
      />
    </div>
  );
}
