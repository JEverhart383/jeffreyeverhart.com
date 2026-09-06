"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

export default function CssVariablesPage() {
  const [hue, setHue] = useState(220);
  const [saturation, setSaturation] = useState(80);
  const [animating, setAnimating] = useState(false);
  const [showRegistered, setShowRegistered] = useState(true);

  // Trigger re-animation by toggling a key
  const [animKey, setAnimKey] = useState(0);

  function triggerAnimation() {
    setAnimKey((k) => k + 1);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 2500);
  }

  const cssPropertyDefs = `
    @property --hue-start {
      syntax: '<number>';
      inherits: false;
      initial-value: ${hue};
    }
    @property --hue-end {
      syntax: '<number>';
      inherits: false;
      initial-value: ${hue + 120};
    }
    @keyframes gradient-registered-${animKey} {
      from {
        --hue-start: ${hue};
        --hue-end: ${hue + 120};
      }
      to {
        --hue-start: ${hue + 360};
        --hue-end: ${hue + 480};
      }
    }
    @keyframes gradient-unregistered-${animKey} {
      from { background: linear-gradient(135deg, hsl(${hue}, ${saturation}%, 60%), hsl(${hue + 120}, ${saturation}%, 60%)); }
      to   { background: linear-gradient(135deg, hsl(${hue + 360}, ${saturation}%, 60%), hsl(${hue + 480}, ${saturation}%, 60%)); }
    }
    .registered-box-${animKey} {
      --hue-start: ${hue};
      --hue-end: ${hue + 120};
      background: linear-gradient(135deg,
        hsl(var(--hue-start), ${saturation}%, 60%),
        hsl(var(--hue-end), ${saturation}%, 60%)
      );
      animation: gradient-registered-${animKey} 2s ease-in-out infinite alternate;
    }
    .unregistered-box-${animKey} {
      animation: gradient-unregistered-${animKey} 2s ease-in-out infinite alternate;
    }
  `;

  return (
    <PageLayout
      title="CSS Custom Properties"
      description="Without @property, the browser treats custom properties as opaque strings — they can't be interpolated. Registering a property with a syntax type unlocks smooth transitions between values."
      library="CSS"
    >
      <style>{cssPropertyDefs}</style>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl p-8 flex flex-col gap-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420 }}
        >
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* Unregistered */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(107,107,128,0.2)", color: "var(--text-muted)" }}
                >
                  no @property
                </span>
              </div>
              <div
                className={`flex-1 rounded-xl flex items-center justify-center min-h-32 ${animating ? `unregistered-box-${animKey}` : ""}`}
                style={{
                  background: `linear-gradient(135deg, hsl(${hue}, ${saturation}%, 60%), hsl(${hue + 120}, ${saturation}%, 60%))`,
                }}
              >
                <span className="text-sm font-mono font-semibold text-white/80 drop-shadow">flickers</span>
              </div>
              <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
                The browser cannot interpolate the <span style={{ color: "var(--text)" }}>background</span> shorthand — it jumps between keyframes with no smooth transition.
              </p>
            </div>

            {/* Registered */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(109,106,255,0.2)", color: "var(--accent)" }}
                >
                  with @property
                </span>
              </div>
              <div
                className={`flex-1 rounded-xl flex items-center justify-center min-h-32 ${animating ? `registered-box-${animKey}` : ""}`}
                style={
                  !animating
                    ? {
                        background: `linear-gradient(135deg, hsl(${hue}, ${saturation}%, 60%), hsl(${hue + 120}, ${saturation}%, 60%))`,
                      }
                    : undefined
                }
              >
                <span className="text-sm font-mono font-semibold text-white/80 drop-shadow">smooth</span>
              </div>
              <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
                <span style={{ color: "var(--text)" }}>--hue-start</span> is a registered <span style={{ color: "var(--text)" }}>&lt;number&gt;</span> — the browser interpolates it like any numeric value.
              </p>
            </div>
          </div>

          <button
            onClick={triggerAnimation}
            className="self-start px-5 py-2 rounded-lg text-sm font-mono font-semibold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            ▶ animate
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="base hue" value={hue} min={0} max={359} unit="°" onChange={setHue} />
            <SliderControl label="saturation" value={saturation} min={0} max={100} unit="%" onChange={setSaturation} />
          </ControlPanel>

          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: "var(--accent)" }}>@property</span> --hue-start {"{"}<br />
              {"  "}syntax: <span style={{ color: "#86efac" }}>'&lt;number&gt;'</span>;<br />
              {"  "}inherits: false;<br />
              {"  "}initial-value: {hue};<br />
              {"}"}
            </p>
          </div>
        </div>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "unregistered props are strings",
            text: "The browser treats --hue: 220 as an opaque string. It can't interpolate \"220\" → \"580\" — so animating it causes a jump rather than a smooth transition.",
          },
          {
            label: "@property registration",
            text: "Declares a syntax type for a custom property, giving the browser the type information it needs to interpolate values just like built-in CSS properties.",
          },
          {
            label: "inherits: false",
            text: "Prevents the property from cascading down to child elements, avoiding unexpected color inheritance from ancestor elements that also use the property.",
          },
          {
            label: "the trick",
            text: "Gradient colors use hsl(var(--hue), ...). When --hue is a registered <number>, the browser smoothly tweens the number — the gradient color changes as a side effect.",
          },
        ]}
        code={`@property --hue {
  syntax: '<number>';   /* typed — browser can interpolate */
  inherits: false;
  initial-value: 220;
}

@keyframes spin {
  from { --hue: 220; }
  to   { --hue: 580; }  /* browser interpolates 220→580 */
}

.box {
  background: linear-gradient(135deg,
    hsl(var(--hue), 80%, 60%),
    hsl(calc(var(--hue) + 120), 80%, 60%)
  );
  animation: spin 2s ease-in-out infinite alternate;
}`}
      />
    </PageLayout>
  );
}
