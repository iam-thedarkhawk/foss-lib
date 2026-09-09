import { Link } from "react-router-dom";
import type { AlternativeListItem } from "../types";

export default function AlternativeCard({
  alternative,
}: {
  alternative: AlternativeListItem;
}) {
  return (
    <article className="catalogue-card p-6 flex flex-col justify-between gap-5 transition-shadow hover:shadow-card-hover">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
          <span className="font-mono text-[11px] uppercase tracking-wider text-pine font-medium">
            Open Source Alternative
          </span>
          <div className="flex items-center gap-1.5">
            {alternative.stars ? (
              <span className="font-mono text-[11px] text-amber flex items-center gap-0.5">
                ★ {alternative.stars.toLocaleString()}
              </span>
            ) : null}
            <span className="tag-pill font-semibold">{alternative.license}</span>
          </div>
        </div>

        <Link
          to={`/alternatives/${alternative.id}`}
          className="font-display text-2xl sm:text-3xl font-bold underline decoration-rust decoration-2 underline-offset-2 hover:text-rust text-ink block"
        >
          {alternative.name}
        </Link>

        <p className="text-sm text-ink/80 mt-2.5 leading-relaxed">
          {alternative.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {alternative.platforms.map((platform) => (
            <span
              key={platform}
              className="text-[10px] font-mono px-1.5 py-0.5 bg-paper border border-ink/30 text-ink/70"
            >
              {platform.replace("_", " ").toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-ink/15 pt-4 flex flex-col gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/60 mb-1 font-semibold">
            Alternative to:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {alternative.apps && alternative.apps.length > 0 ? (
              alternative.apps.map((link) => (
                <span
                  key={link.id}
                  className="font-medium text-xs px-2 py-0.5 bg-card border border-ink/30 text-ink"
                >
                  {link.app.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-ink/50 italic">General utility</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {alternative.repoUrl && (
              <a
                href={alternative.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-pine hover:text-ink underline"
              >
                source code ↗
              </a>
            )}
            {alternative.website && (
              <a
                href={alternative.website}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-rust hover:text-ink underline"
              >
                website ↗
              </a>
            )}
          </div>

          <Link
            to={`/alternatives/${alternative.id}`}
            className="font-mono text-xs font-semibold text-ink underline decoration-rust decoration-1 underline-offset-2"
          >
            view card →
          </Link>
        </div>
      </div>
    </article>
  );
}
