"use client";

import { useState, useEffect, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import { SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const ACCENT = "var(--accent)";
const ORANGE = "#fb923c";
const TEAL = "#2dd4bf";

function Panel({
  title,
  subtitle,
  color,
  cssText,
  children,
}: {
  title: string;
  subtitle: string;
  color: string;
  cssText: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div>
        <p className="text-sm font-semibold mb-0.5">{title}</p>
        <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-1.5 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
        <span>↑ content before</span>
        <div style={{ minHeight: 64 }}>{children}</div>
        <span>↓ content after</span>
      </div>

      <pre
        className="text-xs font-mono leading-relaxed rounded-lg p-3"
        style={{ color, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
      >
        {cssText}
      </pre>
    </div>
  );
}

function DemoBox({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="w-full h-16 rounded-lg flex items-center justify-center text-xs font-mono font-semibold"
      style={{
        background: `${color}22`,
        border: `2px solid ${color}`,
        color,
      }}
    >
      {label}
    </div>
  );
}

export default function OpacityVisibilityPage() {
  const [hidden, setHidden] = useState(false);
  const [loop, setLoop] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!loop) return;
    intervalRef.current = setInterval(() => setHidden((h) => !h), 1600);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [loop]);

  return (
    <PageLayout
      title="Opacity & Visibility"
      description="Three ways to hide an element — only one of them actually animates. Watch the 'content after' line to see which properties collapse the layout and which preserve it."
      library="CSS"
    >
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => setHidden((h) => !h)}
          className="text-xs font-mono py-1.5 px-4 rounded-lg font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "white" }}
        >
          {hidden ? "show" : "hide"}
        </button>
        <SwitchControl label="loop" checked={loop} onChange={setLoop} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Panel
          title="opacity"
          subtitle="fades smoothly — element still takes up space and still receives pointer events"
          color={ACCENT}
          cssText={`opacity: ${hidden ? 0 : 1};\ntransition: opacity 0.5s ease;`}
        >
          <div
            style={{
              opacity: hidden ? 0 : 1,
              transition: "opacity 0.5s ease",
            }}
          >
            <DemoBox color={ACCENT} label="opacity" />
          </div>
        </Panel>

        <Panel
          title="visibility"
          subtitle="snaps instantly — element still takes up space but receives no pointer events"
          color={ORANGE}
          cssText={`visibility: ${hidden ? "hidden" : "visible"};\n/* no interpolation — snaps */`}
        >
          <div style={{ visibility: hidden ? "hidden" : "visible" }}>
            <DemoBox color={ORANGE} label="visibility" />
          </div>
        </Panel>

        <Panel
          title="display"
          subtitle="snaps and collapses — element removed from layout entirely, 'content after' shifts up"
          color={TEAL}
          cssText={`display: ${hidden ? "none" : "block"};\n/* can't transition — instant removal */`}
        >
          <div style={{ display: hidden ? "none" : "block" }}>
            <DemoBox color={TEAL} label="display" />
          </div>
        </Panel>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "only opacity interpolates",
            text: "opacity is a numeric value the browser can tween between 0 and 1. visibility and display are keyword properties with no intermediate state — they can only snap.",
          },
          {
            label: "layout impact",
            text: "opacity: 0 and visibility: hidden both keep the element in the layout flow — its space is preserved and siblings don't shift. display: none removes it entirely, collapsing its space.",
          },
          {
            label: "pointer events",
            text: "An opacity: 0 element is invisible but still interactive — it receives clicks and stays in the tab order. Add pointer-events: none to opt out. visibility: hidden removes interactivity automatically.",
          },
          {
            label: "the practical pattern",
            text: "For animated show/hide: transition opacity for the visual fade, and pair with visibility or pointer-events: none so hidden elements don't trap keyboard focus or intercept clicks.",
          },
        ]}
        code={`/* Only opacity actually animates */
.fade { opacity: 1; transition: opacity 0.4s ease; }
.fade.hidden { opacity: 0; }

/* visibility snaps — but delay keeps layout until fade is done */
.fade-hide {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease,
              visibility 0s 0.4s; /* delay matches opacity duration */
}

/* opacity: 0 elements still receive clicks — opt out explicitly */
.hidden-accessible {
  opacity: 0;
  pointer-events: none;
}`}
      />
    </PageLayout>
  );
}
