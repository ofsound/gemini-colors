import React, {useEffect, useMemo, useState} from "react";

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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string): RGB => {
  const normalized = hex.replace("#", "").trim();
  const safeHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);

  const parsed = Number.parseInt(safeHex, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
};

const rgbToHex = ({r, g, b}: RGB) => `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`;

const rgbToHsv = ({r, g, b}: RGB): HSV => {
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

  return {h, s, v};
};

const hsvToRgb = ({h, s, v}: HSV): RGB => {
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

  const full = isShort
    ? withoutHash
        .split("")
        .map((char) => char + char)
        .join("")
    : withoutHash;

  return `#${full.toUpperCase()}`;
};

export const ChromeColorPicker: React.FC<ChromeColorPickerProps> = ({value, onChange, label}) => {
  const hsv = useMemo(() => rgbToHsv(hexToRgb(value)), [value]);
  const [dragMode, setDragMode] = useState<"xy" | null>(null);
  const [hexInput, setHexInput] = useState(value.toUpperCase());
  const [hexInvalid, setHexInvalid] = useState(false);

  useEffect(() => {
    setHexInput(value.toUpperCase());
    setHexInvalid(false);
  }, [value]);

  useEffect(() => {
    if (!dragMode) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (dragMode !== "xy") return;

      const panel = document.getElementById(`${label}-xy-panel`);
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const x = clamp(event.clientX - rect.left, 0, rect.width);
      const y = clamp(event.clientY - rect.top, 0, rect.height);

      const nextH = (x / rect.width) * 360;
      const yRatio = y / rect.height;
      const inTopHalf = yRatio <= 0.5;

      const nextS = inTopHalf ? 100 : 100 - ((yRatio - 0.5) / 0.5) * 100;
      const nextV = inTopHalf ? (yRatio / 0.5) * 100 : 100;

      onChange(hsvToHex({h: nextH, s: nextS, v: nextV}));
    };

    const handlePointerUp = () => setDragMode(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragMode, hsv.h, hsv.s, hsv.v, label, onChange]);

  const saturationPointerX = `${(hsv.h / 360) * 100}%`;
  const saturationPointerY =
    hsv.v >= 99.5
      ? `${50 + ((100 - hsv.s) / 100) * 50}%`
      : `${(hsv.v / 100) * 50}%`;

  const onXYPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const panel = event.currentTarget;
    const rect = panel.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = clamp(event.clientY - rect.top, 0, rect.height);
    const nextH = (x / rect.width) * 360;
    const yRatio = y / rect.height;
    const inTopHalf = yRatio <= 0.5;

    const nextS = inTopHalf ? 100 : 100 - ((yRatio - 0.5) / 0.5) * 100;
    const nextV = inTopHalf ? (yRatio / 0.5) * 100 : 100;

    onChange(hsvToHex({h: nextH, s: nextS, v: nextV}));
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

  return (
    <div className="chrome-picker" aria-label={`${label} color picker`}>
      <div className="chrome-picker-footer">
        <div className="chrome-swatch" style={{backgroundColor: value}} />
        <div className="chrome-hex-editor">
          <input
            className={`chrome-hex-input${hexInvalid ? " invalid" : ""}`}
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
          <span className="chrome-hex-hint">Hex</span>
        </div>
      </div>

      <div id={`${label}-xy-panel`} className="chrome-sv-panel" onPointerDown={onXYPointerDown} role="slider" aria-label={`${label} hue and brightness`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(hsv.v)}>
        <div
          className="chrome-sv-pointer"
          style={{
            left: saturationPointerX,
            top: saturationPointerY,
          }}
        />
      </div>
    </div>
  );
};
