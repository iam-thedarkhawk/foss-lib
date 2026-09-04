import { Link } from "react-router-dom";
import type { ProprietaryApp } from "../types";

const LICENSE_LABEL: Record<string, string> = {
  MIT: "MIT",
  GPLV2: "GPLv2",
  GPLV3: "GPLv3",
  APACHE2: "Apache 2.0",
  BSD: "BSD",
  MPL2: "MPL 2.0",
  AGPL: "AGPL",
  OTHER: "Other",
};

export default function AppCard({ app }: { app: ProprietaryApp }) {
  return (
    <article className="catalogue-card p-5 flex flex-col gap-4">
      <div>
        <p className="font-mono text-[11px] text-pine mb-1">{app.category.name}</p>
        <h2 className="font-display text-2xl">{app.name}</h2>
        <p className="text-sm text-ink/80 mt-1">{app.description}</p>
      </div>

      <div className="border-t border-ink/20 pt-3 flex flex-col gap-3">
        <p className="font-mono text-[11px] text-ink/60">open source alternatives</p>
        {app.alternatives.length === 0 && (
          <p className="text-sm italic text-ink/50">No alternatives catalogued yet.</p>
        )}
        {app.alternatives.map((link) => (
          <div key={link.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/alternatives/${link.alternative.id}`}
                className="font-semibold underline decoration-rust decoration-2 underline-offset-2"
              >
                {link.alternative.name}
              </Link>
              <span className="tag-pill">{LICENSE_LABEL[link.alternative.license]}</span>
              {link.alternative.platforms.map((p) => (
                <span key={p} className="tag-pill">
                  {p.replace("_", " ").toLowerCase()}
                </span>
              ))}
            </div>
            {link.fitNotes && (
              <p className="text-xs text-ink/60 italic">{link.fitNotes}</p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
