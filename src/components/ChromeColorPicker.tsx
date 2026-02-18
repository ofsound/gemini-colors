import { useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "@/utils/clamp";
import { expandShortHex } from "@/utils/color";

interface ChromeColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

const hexToRgb = (hex: string): RGB => {
  const safeHex = expandShortHex(hex);

  const parsed = Number.parseInt(safeHex, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
};

const rgbToHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`;

const rgbToHsv = ({ r, g, b }: RGB): HSV => {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;

  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rN) h = ((gN - bN) / delta) % 6;
    else if (max === gN) h = (bN - rN) / delta + 2;
    else h = (rN - gN) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return { h, s, v };
};

const hsvToRgb = ({ h, s, v }: HSV): RGB => {
  const saturation = clamp(s, 0, 100) / 100;
  const value = clamp(v, 0, 100) / 100;
  const hue = ((h % 360) + 360) % 360;

  const chroma = value * saturation;
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = value - chroma;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hue < 60) [rPrime, gPrime, bPrime] = [chroma, second, 0];
  else if (hue < 120) [rPrime, gPrime, bPrime] = [second, chroma, 0];
  else if (hue < 180) [rPrime, gPrime, bPrime] = [0, chroma, second];
  else if (hue < 240) [rPrime, gPrime, bPrime] = [0, second, chroma];
  else if (hue < 300) [rPrime, gPrime, bPrime] = [second, 0, chroma];
  else [rPrime, gPrime, bPrime] = [chroma, 0, second];

  return {
    r: (rPrime + match) * 255,
    g: (gPrime + match) * 255,
    b: (bPrime + match) * 255,
  };
};

const hsvToHex = (hsv: HSV) => rgbToHex(hsvToRgb(hsv));

const normalizeHex = (input: string): string | null => {
  const trimmed = input.trim();
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  const isShort = /^[0-9a-fA-F]{3}$/.test(withoutHash);
  const isLong = /^[0-9a-fA-F]{6}$/.test(withoutHash);

  if (!isShort && !isLong) return null;

  const full = isShort ? expandShortHex(withoutHash) : withoutHash;

  return `#${full.toUpperCase()}`;
};

const rgbToDisplayString = ({ r, g, b }: RGB) => `${r}, ${g}, ${b}`;

const SV_PANEL_BACKGROUND =
  "linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0) 50%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 50%, #fff 100%), linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";

function pointerEventToHsv(
  rect: DOMRect,
  clientX: number,
  clientY: number,
): HSV {
  const x = clamp(clientX - rect.left, 0, rect.width);
  const y = clamp(clientY - rect.top, 0, rect.height);
  const nextH = (x / rect.width) * 360;
  const yRatio = y / rect.height;
  const inTopHalf = yRatio <= 0.5;

  const nextS = inTopHalf ? 100 : 100 - ((yRatio - 0.5) / 0.5) * 100;
  const nextV = inTopHalf ? (yRatio / 0.5) * 100 : 100;

  return { h: nextH, s: nextS, v: nextV };
}

const normalizeRgbInput = (input: string): RGB | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^rgb\s*\((.*)\)$/i);
  const content = match ? match[1] : trimmed;
  const parts = content.split(/[\s,]+/).filter(Boolean);

  if (parts.length !== 3) return null;

  const channels = parts.map((part) => Number(part));
  if (channels.some((channel) => !Number.isFinite(channel))) return null;
  if (channels.some((channel) => channel < 0 || channel > 255)) return null;

  return {
    r: Math.round(channels[0]),
    g: Math.round(channels[1]),
    b: Math.round(channels[2]),
  };
};

export function ChromeColorPicker({
  value,
  onChange,
  label,
}: ChromeColorPickerProps) {
  const hsv = useMemo(() => rgbToHsv(hexToRgb(value)), [value]);
  const [dragMode, setDragMode] = useState<"xy" | null>(null);
  const [hexInput, setHexInput] = useState(value.toUpperCase());
  const [hexInvalid, setHexInvalid] = useState(false);
  const [rgbInput, setRgbInput] = useState(rgbToDisplayString(hexToRgb(value)));
  const [rgbInvalid, setRgbInvalid] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync external prop changes to internal input state during render
  // (preferred over useEffect to avoid an extra render cycle)
  if (value !== prevValue) {
    setPrevValue(value);
    setHexInput(value.toUpperCase());
    setRgbInput(rgbToDisplayString(hexToRgb(value)));
    setHexInvalid(false);
    setRgbInvalid(false);
  }

  useEffect(() => {
    if (!dragMode) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (dragMode !== "xy") return;

      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      const hsv = pointerEventToHsv(rect, event.clientX, event.clientY);
      onChange(hsvToHex(hsv));
    };

    const handlePointerUp = () => setDragMode(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragMode, onChange]);

  const saturationPointerX = `${(hsv.h / 360) * 100}%`;
  const saturationPointerY =
    hsv.v >= 99.5
      ? `${50 + ((100 - hsv.s) / 100) * 50}%`
      : `${(hsv.v / 100) * 50}%`;

  const onXYPointerDown: React.PointerEventHandler<HTMLDivElement> = (
    event,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hsv = pointerEventToHsv(rect, event.clientX, event.clientY);
    onChange(hsvToHex(hsv));
    setDragMode("xy");
  };

  const commitHexInput = () => {
    const normalized = normalizeHex(hexInput);
    if (!normalized) {
      setHexInvalid(true);
      return;
    }

    setHexInvalid(false);
    setHexInput(normalized);
    onChange(normalized.toLowerCase());
  };

  const commitRgbInput = () => {
    const normalized = normalizeRgbInput(rgbInput);
    if (!normalized) {
      setRgbInvalid(true);
      return;
    }

    setRgbInvalid(false);
    setRgbInput(rgbToDisplayString(normalized));
    onChange(rgbToHex(normalized));
  };

  return (
    <div
      className="w-[clamp(130px,42vw,320px)] min-w-0 flex-1 select-none"
      aria-label={`${label} color picker`}
    >
      {/* Mobile: panel top, inputs row (inputs + swatch) bottom. Desktop: inputs row top, panel bottom */}
      <div className="flex flex-col flex-col-reverse gap-3 sm:flex-col">
        <div
          className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div
            className="flex w-full min-w-0 shrink-0 flex-col items-stretch gap-2 sm:w-[92px] sm:max-w-[92px]"
          >
            <input
              className={`border-border bg-background/50 text-foreground placeholder:text-placeholder focus-visible:outline-focus/60 box-border h-8 w-full max-w-full rounded border px-2 font-sans text-sm tracking-[0.04em] uppercase focus-visible:outline-2 focus-visible:outline-offset-1 ${hexInvalid ? "ring-1 ring-red-400" : ""}`}
              type="text"
              value={hexInput}
              aria-label={`${label} hex color`}
              spellCheck={false}
              onChange={(event) => {
                setHexInput(event.target.value.toUpperCase());
                if (hexInvalid) setHexInvalid(false);
              }}
              onBlur={commitHexInput}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitHexInput();
                }
              }}
            />
            <input
              className={`border-border bg-background/50 text-foreground placeholder:text-placeholder focus-visible:outline-focus/60 box-border h-8 w-full max-w-full rounded border px-2 font-sans text-sm tracking-[0.02em] focus-visible:outline-2 focus-visible:outline-offset-1 ${rgbInvalid ? "ring-1 ring-red-400" : ""}`}
              type="text"
              value={rgbInput}
              aria-label={`${label} rgb color`}
              spellCheck={false}
              onChange={(event) => {
                setRgbInput(event.target.value);
                if (rgbInvalid) setRgbInvalid(false);
              }}
              onBlur={commitRgbInput}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitRgbInput();
                }
              }}
            />
          </div>
          <div
            className="h-[72px] min-w-0 flex-1 rounded-md"
            style={{ backgroundColor: value }}
          />
        </div>
        <div
          ref={panelRef}
          className="border-border relative h-[clamp(100px,23.125vw,150px)] cursor-crosshair touch-none overflow-hidden rounded-md border"
          style={{ background: SV_PANEL_BACKGROUND }}
          onPointerDown={onXYPointerDown}
          role="slider"
          aria-label={`${label} hue and brightness`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(hsv.v)}
          aria-valuetext={`Hue: ${Math.round(hsv.h)}°, Saturation: ${Math.round(hsv.s)}%, Value: ${Math.round(hsv.v)}%`}
        >
          <div
            className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{
              left: saturationPointerX,
              top: saturationPointerY,
            }}
          />
        </div>
      </div>
    </div>
  );
}


