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

export const ChromeColorPicker: React.FC<ChromeColorPickerProps> = ({value, onChange, label}) => {
  const hsv = useMemo(() => rgbToHsv(hexToRgb(value)), [value]);
  const [dragMode, setDragMode] = useState<"sv" | "h" | null>(null);

  useEffect(() => {
    if (!dragMode) return;

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (dragMode === "sv") {
        const panel = document.getElementById(`${label}-sv-panel`);
        if (!panel) return;
        const rect = panel.getBoundingClientRect();
        const x = clamp(event.clientX - rect.left, 0, rect.width);
        const y = clamp(event.clientY - rect.top, 0, rect.height);

        const nextS = (x / rect.width) * 100;
        const nextV = 100 - (y / rect.height) * 100;
        onChange(hsvToHex({h: hsv.h, s: nextS, v: nextV}));
      }

      if (dragMode === "h") {
        const slider = document.getElementById(`${label}-hue-slider`);
        if (!slider) return;
        const rect = slider.getBoundingClientRect();
        const x = clamp(event.clientX - rect.left, 0, rect.width);
        const nextH = (x / rect.width) * 360;
        onChange(hsvToHex({h: nextH, s: hsv.s, v: hsv.v}));
      }
    };

    const handlePointerUp = () => setDragMode(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragMode, hsv.h, hsv.s, hsv.v, label, onChange]);

  const saturationPointerX = `${hsv.s}%`;
  const saturationPointerY = `${100 - hsv.v}%`;
  const huePointerX = `${(hsv.h / 360) * 100}%`;

  const onSatValPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const panel = event.currentTarget;
    const rect = panel.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = clamp(event.clientY - rect.top, 0, rect.height);
    const nextS = (x / rect.width) * 100;
    const nextV = 100 - (y / rect.height) * 100;

    onChange(hsvToHex({h: hsv.h, s: nextS, v: nextV}));
    setDragMode("sv");
  };

  const onHuePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const slider = event.currentTarget;
    const rect = slider.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const nextH = (x / rect.width) * 360;

    onChange(hsvToHex({h: nextH, s: hsv.s, v: hsv.v}));
    setDragMode("h");
  };

  return (
    <div className="chrome-picker" aria-label={`${label} color picker`}>
      <div id={`${label}-sv-panel`} className="chrome-sv-panel" style={{backgroundColor: `hsl(${hsv.h}, 100%, 50%)`}} onPointerDown={onSatValPointerDown} role="slider" aria-label={`${label} saturation and brightness`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(hsv.s)}>
        <div className="chrome-sv-white" />
        <div className="chrome-sv-black" />
        <div
          className="chrome-sv-pointer"
          style={{
            left: saturationPointerX,
            top: saturationPointerY,
          }}
        />
      </div>

      <div id={`${label}-hue-slider`} className="chrome-hue-slider" onPointerDown={onHuePointerDown} role="slider" aria-label={`${label} hue`} aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(hsv.h)}>
        <div className="chrome-hue-pointer" style={{left: huePointerX}} />
      </div>

      <div className="chrome-picker-footer">
        <div className="chrome-swatch" style={{backgroundColor: value}} />
        <span className="chrome-hex-value">{value.toUpperCase()}</span>
      </div>
    </div>
  );
};
