import { Link } from "react-router-dom";
import type { ProprietaryApp } from "../types";

export default function AppCard({ app }: { app: ProprietaryApp }) {
  return (
    <article className="catalogue-card p-6 flex flex-col justify-between gap-5 transition-shadow hover:shadow-card-hover">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-pine font-medium">
            {app.category.icon ? `${app.category.icon} ` : ""}
            {app.category.name}
          </span>
          {app.website && (
            <a
              href={app.website}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] text-ink/50 hover:text-rust underline"
              title="Official proprietary product site"
            >
              official site ↗
            </a>
          )}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          {app.name}
        </h2>
        <p className="text-sm text-ink/80 mt-2 leading-relaxed">{app.description}</p>
      </div>

      <div className="border-t-2 border-ink/15 pt-4 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-semibold">
            FOSS Alternatives ({app.alternatives.length})
          </p>
        </div>

        {app.alternatives.length === 0 ? (
          <p className="text-sm italic text-ink/50">No alternatives catalogued yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {app.alternatives.map((link) => (
              <div
                key={link.id}
                className="p-3 bg-paper/60 border border-ink/20 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Link
                    to={`/alternatives/${link.alternative.id}`}
                    className="font-display text-lg font-bold underline decoration-rust decoration-2 underline-offset-2 hover:text-rust text-ink"
                  >
                    {link.alternative.name}
                  </Link>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="tag-pill font-semibold">
                      {link.alternative.license}
                    </span>
                    {link.alternative.repoUrl && (
                      <a
                        href={link.alternative.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="tag-pill hover:bg-ink hover:text-paper"
                        title="Source Code Repository"
                      >
                        repo ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-0.5">
                  {link.alternative.platforms.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] font-mono px-1.5 py-0.5 bg-card border border-ink/20 text-ink/70"
                    >
                      {p.replace("_", " ").toLowerCase()}
                    </span>
                  ))}
                </div>

                {link.fitNotes && (
                  <p className="text-xs text-ink/70 italic mt-1 bg-amber/10 px-2 py-1 border-l-2 border-amber">
                    {link.fitNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
