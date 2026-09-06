import Link from "next/link";

interface PageLayoutProps {
  title: string;
  description: string;
  library: string;
  libraryColor?: string;
  children: React.ReactNode;
}

const LIBRARY_COLORS: Record<string, string> = {
  CSS: "#38bdf8",
  "Framer Motion": "#a78bfa",
  GSAP: "#86efac",
  "Three.js": "#fb923c",
  Canvas: "#fbbf24",
};

export default function PageLayout({ title, description, library, libraryColor, children }: PageLayoutProps) {
  const color = libraryColor ?? LIBRARY_COLORS[library] ?? "#6b6b80";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link href="/" className="text-xs font-mono inline-flex items-center gap-1.5 w-fit" style={{ color: "var(--text-muted)" }}>
          ← all topics
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <span
            className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${color}20`, color }}
          >
            {library}
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
      {children}
    </div>
  );
}
