interface Concept {
  label: string;
  text: string;
}

interface ConceptSectionProps {
  concepts: Concept[];
  code: string;
}

export function ConceptSection({ concepts, code }: ConceptSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p
          className="text-xs font-mono font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          concepts
        </p>
        <div className="flex flex-col gap-3">
          {concepts.map(({ label, text }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs font-mono font-semibold" style={{ color: "var(--accent)" }}>
                {label}
              </span>
              <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p
          className="text-xs font-mono font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          core pattern
        </p>
        <pre
          className="text-xs font-mono leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--text)" }}
        >
          {code}
        </pre>
      </div>
    </div>
  );
}
