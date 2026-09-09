import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `font-mono text-sm tracking-tight px-3 py-1.5 border transition-all ${
    isActive
      ? "bg-ink text-paper border-ink shadow-sm"
      : "border-transparent text-ink/80 hover:border-ink/40 hover:text-ink"
  }`;

export default function Header() {
  return (
    <header className="border-b-2 border-ink bg-paper sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-pine"></span>
            <p className="font-mono text-xs text-pine tracking-tight uppercase">
              catalogue no. 001 — open source index
            </p>
          </div>
          <NavLink to="/" className="inline-block group">
            <h1 className="font-display text-4xl sm:text-5xl leading-none font-bold tracking-tight">
              FOSS<span className="text-rust group-hover:underline decoration-2 underline-offset-4">Lib</span>
            </h1>
          </NavLink>
        </div>
        <nav className="flex items-center gap-2 flex-wrap">
          <NavLink to="/" className={linkClass} end>
            Browse Catalogue
          </NavLink>
          <NavLink to="/submit" className={linkClass}>
            Submit an Entry
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
