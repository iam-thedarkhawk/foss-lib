import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { AlternativeDetail as AlternativeDetailData } from "../types";

export default function AlternativeDetail() {
  const { id } = useParams();
  const [alternative, setAlternative] = useState<AlternativeDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getAlternative(id)
      .then((data) => {
        setAlternative(data);
        setLoading(false);
      })
      .catch((requestError) => {
        setError(requestError.message ?? "Could not load this alternative.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="font-mono text-sm text-ink/60 animate-pulse">
          Retrieving detailed index card...
        </p>
      </div>
    );
  }

  if (error || !alternative) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="font-mono text-xs text-pine underline underline-offset-4">
          ← Back to catalogue
        </Link>
        <div className="catalogue-card p-8 mt-6 border-2 border-rust text-rust">
          <h3 className="font-display text-2xl font-bold mb-2">Record Not Found</h3>
          <p className="font-mono text-sm">{error || "Could not find this catalogue record."}</p>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-10">
      <Link
        to="/"
        className="font-mono text-xs text-pine hover:text-ink underline underline-offset-4 inline-flex items-center gap-1"
      >
        <span>← Back to catalogue index</span>
      </Link>

      <div className="catalogue-card mt-6 p-6 sm:p-10 border-2 border-ink shadow-card-deep">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-rust"></span>
            <p className="font-mono text-xs text-pine uppercase tracking-wider font-semibold">
              Open Source Alternative Card
            </p>
          </div>
          {alternative.stars ? (
            <span className="font-mono text-xs text-amber font-semibold">
              ★ {alternative.stars.toLocaleString()} GitHub stars
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4">
          {alternative.name}
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl leading-relaxed text-ink/85 font-body">
          {alternative.description}
        </p>

        {/* Specs & Badges */}
        <div className="border-t-2 border-ink/20 mt-8 pt-6 flex flex-col gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-ink/60 block mb-2 font-semibold">
              License & Distribution
            </span>
            <span className="tag-pill font-bold !text-xs !py-1 !px-3">
              {alternative.license}
            </span>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-ink/60 block mb-2 font-semibold">
              Supported Platforms
            </span>
            <div className="flex flex-wrap gap-1.5">
              {alternative.platforms.map((platform) => (
                <span
                  key={platform}
                  className="tag-pill font-mono !text-xs !py-1 !px-2.5 bg-paper"
                >
                  {platform.replace("_", " ").toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="mt-8 pt-6 border-t-2 border-ink/20 flex flex-wrap gap-4">
          {alternative.repoUrl && (
            <a
              href={alternative.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="stamp-button inline-flex items-center gap-2 text-sm"
            >
              <span>View Source Repository ↗</span>
            </a>
          )}
          {alternative.website && (
            <a
              href={alternative.website}
              target="_blank"
              rel="noreferrer"
              className="stamp-button inline-flex items-center gap-2 text-sm !bg-rust !text-paper hover:!bg-rust/90"
            >
              <span>Visit Official Website ↗</span>
            </a>
          )}
        </div>

        {/* Substituted Proprietary Apps */}
        <div className="border-t-2 border-ink/20 mt-10 pt-6">
          <h3 className="font-mono text-xs uppercase tracking-wider text-ink/60 mb-4 font-semibold">
            Proprietary Software Replaced ({alternative.apps.length})
          </h3>
          <div className="flex flex-col gap-4">
            {alternative.apps.map((link) => (
              <div
                key={link.id}
                className="p-4 bg-paper/80 border border-ink/30 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-display text-2xl font-bold text-ink">
                    {link.app.name}
                  </h4>
                  <span className="font-mono text-xs text-pine bg-card px-2 py-0.5 border border-ink/20">
                    {link.app.category.name}
                  </span>
                </div>
                <p className="text-sm text-ink/80">{link.app.description}</p>
                {link.fitNotes && (
                  <div className="mt-1 pt-2 border-t border-ink/10 text-xs text-ink/75 italic bg-amber/10 p-2 border-l-2 border-amber">
                    <strong className="not-italic font-mono uppercase text-[10px] text-ink/80 block mb-0.5">
                      Compatibility & Feature Fit:
                    </strong>
                    {link.fitNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
