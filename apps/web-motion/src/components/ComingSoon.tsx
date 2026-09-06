export default function ComingSoon({ topic }: { topic: string }) {
  return (
    <div
      className="rounded-xl flex flex-col items-center justify-center gap-3 py-24"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <span className="text-2xl">🚧</span>
      <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
        {topic} — coming soon
      </p>
    </div>
  );
}
