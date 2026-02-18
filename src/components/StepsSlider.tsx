import "@/components/StepsSlider.css";
import { clamp } from "@/utils/clamp";

const STEPS_MIN = 1;
const STEPS_MAX = 50;
const STEPS_SLIDER_PRECISION = 1000;
const STEPS_EXPONENT = 2.45;

const stepsFromSliderPosition = (position: number) => {
  const clampedPosition = clamp(position, 0, STEPS_SLIDER_PRECISION);
  const normalizedPosition = clampedPosition / STEPS_SLIDER_PRECISION;
  const curved = Math.pow(normalizedPosition, STEPS_EXPONENT);
  const mapped = STEPS_MIN + (STEPS_MAX - STEPS_MIN) * curved;
  return Math.round(mapped);
};

const sliderPositionFromSteps = (steps: number) => {
  const clampedSteps = clamp(steps, STEPS_MIN, STEPS_MAX);
  const normalizedSteps = (clampedSteps - STEPS_MIN) / (STEPS_MAX - STEPS_MIN);
  const inverseCurved = Math.pow(normalizedSteps, 1 / STEPS_EXPONENT);
  return Math.round(inverseCurved * STEPS_SLIDER_PRECISION);
};

type StepsSliderProps = {
  value: number;
  onChange: (steps: number) => void;
};

export function StepsSlider({ value, onChange }: StepsSliderProps) {
  const sliderPosition = sliderPositionFromSteps(value);

  return (
    <div
      className="border-border bg-surface flex h-full w-[130px] items-center justify-center rounded-[10px] border py-4"
      aria-label="Steps"
    >
      <input
        className="steps-slider"
        type="range"
        min={0}
        max={STEPS_SLIDER_PRECISION}
        step={1}
        value={sliderPosition}
        onChange={(e) =>
          onChange(stepsFromSliderPosition(Number(e.target.value)))
        }
        aria-label="Steps"
      />
    </div>
  );
}
