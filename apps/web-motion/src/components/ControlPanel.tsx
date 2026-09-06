"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as LabelPrimitive from "@radix-ui/react-label";

interface ControlPanelProps {
  children: React.ReactNode;
}

export function ControlPanel({ children }: ControlPanelProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <span className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Controls
      </span>
      {children}
    </div>
  );
}

interface ControlRowProps {
  label: string;
  value?: string | number;
  children: React.ReactNode;
}

export function ControlRow({ label, value, children }: ControlRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <LabelPrimitive.Root className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {label}
        </LabelPrimitive.Root>
        {value !== undefined && (
          <span className="text-xs font-mono tabular-nums" style={{ color: "var(--accent)" }}>
            {value}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function SliderControl({ label, value, min, max, step = 1, unit = "", onChange }: SliderControlProps) {
  return (
    <ControlRow label={label} value={`${value}${unit}`}>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none h-5 w-full"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      >
        <SliderPrimitive.Track
          className="relative grow rounded-full h-1"
          style={{ background: "var(--border)" }}
        >
          <SliderPrimitive.Range
            className="absolute h-full rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block w-4 h-4 rounded-full shadow-md outline-none focus:ring-2 transition-transform hover:scale-110"
          style={{ background: "var(--accent)", boxShadow: "0 0 0 3px rgba(109,106,255,0.2)" }}
        />
      </SliderPrimitive.Root>
    </ControlRow>
  );
}

interface SwitchControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SwitchControl({ label, checked, onChange }: SwitchControlProps) {
  return (
    <div className="flex items-center justify-between">
      <LabelPrimitive.Root className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
        {label}
      </LabelPrimitive.Root>
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onChange}
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors outline-none focus:ring-2"
        style={{ background: checked ? "var(--accent)" : "var(--border)" }}
      >
        <SwitchPrimitive.Thumb
          className="block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform"
          style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}
