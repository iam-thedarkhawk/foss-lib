import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `font-mono text-sm tracking-tight px-3 py-1 border ${
    isActive ? "bg-ink text-paper border-ink" : "border-transparent hover:border-ink/40"
  }`;

export default function Header() {
  return (
    <header className="border-b-2 border-ink bg-paper">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs text-pine tracking-tight mb-1">
            catalogue no. 001 — open source index
          </p>
          <h1 className="font-display text-4xl leading-none">
            FOSS<span className="text-rust">Lib</span>
          </h1>
        </div>
        <nav className="flex gap-2">
          <NavLink to="/" className={linkClass} end>
            Browse
          </NavLink>
          <NavLink to="/submit" className={linkClass}>
            Submit an entry
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
