"use client";

import PageLayout from "@/components/PageLayout";
import { ConceptSection } from "@/components/ConceptSection";

export default function IndividualTransformsPage() {
  return (
    <PageLayout
      title="Individual Transform Properties"
      description="CSS Transforms Level 2 introduced rotate, scale, and translate as standalone properties. Unlike the transform shorthand, they each live in their own cascade slot — hover the spinning elements to see what that means in practice."
      library="CSS"
    >
      <style>{`
        @keyframes spin-ind {
          to { rotate: 360deg; }
        }
        @keyframes spin-tf {
          to { transform: rotate(360deg); }
        }
        .spin-ind {
          animation: spin-ind 2s linear infinite;
          transition: scale 0.25s ease;
        }
        .spin-ind:hover { scale: 1.4; }
        .spin-tf {
          animation: spin-tf 2s linear infinite;
          transition: transform 0.25s ease;
        }
        .spin-tf:hover { transform: scale(1.4); }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-6 flex flex-col gap-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div>
            <p className="text-sm font-semibold mb-1">Individual Properties</p>
            <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
              rotate and scale are independent — hover scales without breaking the spin
            </p>
          </div>

          <div className="flex items-center justify-center" style={{ minHeight: 160 }}>
            <div
              className="spin-ind w-20 h-20 rounded-xl flex items-center justify-center text-xs font-mono font-semibold cursor-default select-none"
              style={{
                background: "rgba(109,106,255,0.2)",
                border: "2px solid var(--accent)",
                color: "var(--accent)",
              }}
            >
              hover me
            </div>
          </div>

          <pre
            className="text-xs font-mono leading-relaxed rounded-lg p-4"
            style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
          >{`@keyframes spin {
  to { rotate: 360deg; }
}

.element {
  animation: spin 2s linear infinite;
  transition: scale 0.25s ease;
}

.element:hover {
  scale: 1.4; /* ✓ doesn't break spin */
}`}</pre>
        </div>

        <div
          className="rounded-xl p-6 flex flex-col gap-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div>
            <p className="text-sm font-semibold mb-1">Transform Shorthand</p>
            <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
              hover overwrites the entire transform value — the spin breaks on hover
            </p>
          </div>

          <div className="flex items-center justify-center" style={{ minHeight: 160 }}>
            <div
              className="spin-tf w-20 h-20 rounded-xl flex items-center justify-center text-xs font-mono font-semibold cursor-default select-none"
              style={{
                background: "rgba(251,146,60,0.15)",
                border: "2px solid #fb923c",
                color: "#fb923c",
              }}
            >
              hover me
            </div>
          </div>

          <pre
            className="text-xs font-mono leading-relaxed rounded-lg p-4"
            style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
          >{`@keyframes spin {
  to { transform: rotate(360deg); }
}

.element {
  animation: spin 2s linear infinite;
  transition: transform 0.25s ease;
}

.element:hover {
  /* ✗ replaces the animation's transform */
  transform: scale(1.4);
}`}</pre>
        </div>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "non-clobbering",
            text: "Individual properties (rotate, scale, translate) each occupy a separate slot in the cascade. Setting one does not reset the others — unlike the transform shorthand, where any new value replaces the entire list.",
          },
          {
            label: "fixed application order",
            text: "The browser always applies them translate → rotate → scale, regardless of their declaration order in your CSS. This is equivalent to transform: translate() rotate() scale().",
          },
          {
            label: "composable animations",
            text: "Two independent animations targeting separate properties (say, a continuous spin and a hover scale) can run simultaneously on the same element. With the transform shorthand, they'd fight over the same property and one would win.",
          },
          {
            label: "browser support",
            text: "Broadly supported since 2022 — Chrome 104, Safari 14.1, Firefox 72. Safe for production.",
          },
        ]}
        code={`/* Each is an independent CSS property */
translate: 50px 20px;
rotate: 45deg;
scale: 1.5;

/* Fixed order: translate → rotate → scale */
/* Equivalent shorthand: */
transform: translate(50px, 20px) rotate(45deg) scale(1.5);

/* Two animations, no conflict */
@keyframes spin   { to { rotate: 360deg; } }
@keyframes bounce { 50% { translate: 0px -20px; } }

.element {
  animation:
    spin   2s linear    infinite,
    bounce 1s ease-in-out infinite;
}`}
      />
    </PageLayout>
  );
}
