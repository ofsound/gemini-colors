import { useMemo, useRef, useState } from "react";
import type { ColorSpace } from "@/types/color";
import { resolveColorMix } from "@/utils/color";

interface ColorOutputProps {
  startColor: string;
  endColor: string;
  steps: number;
  colorSpace: ColorSpace;
  selectedColor: string | null;
  selectedIndex: number | null;
}

function CopyField({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  function handleFocus() {
    if (value) inputRef.current?.select();
  }

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      inputRef.current?.select();
    }
  }

  return (
    <div>
      <p className="text-neutral-fg mb-2 text-[11px] font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={value}
          onFocus={handleFocus}
          onClick={handleFocus}
          placeholder={placeholder}
          aria-label={label}
          className="border-border bg-neutral-bg text-foreground placeholder:text-placeholder focus-visible:outline-focus/60 min-w-0 flex-1 cursor-text rounded-md border px-3 py-2 font-mono text-xs tracking-[0.04em] uppercase select-all focus-visible:outline-2 focus-visible:outline-offset-2"
        />
        <button
          type="button"
          onClick={handleCopy}
          disabled={!value}
          aria-label={`Copy ${label} to clipboard`}
          className="swap-btn text-button-primary-fg flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function ColorOutput({
  startColor,
  endColor,
  steps,
  colorSpace,
  selectedColor,
  selectedIndex,
}: ColorOutputProps) {
  const hexValues = useMemo(
    () => resolveColorMix(startColor, endColor, steps, colorSpace),
    [startColor, endColor, steps, colorSpace],
  );

  const outputText = hexValues.join(", ");

  return (
    <div className="border-border bg-surface mt-4 flex flex-col gap-4 rounded-xl border px-4 py-3">
      <CopyField label="All" value={outputText} />
      <CopyField
        label={
          selectedIndex !== null ? `Selected: ${selectedIndex}` : "Selected"
        }
        value={selectedColor ?? ""}
        placeholder="Click a swatch above…"
      />
    </div>
  );
}
