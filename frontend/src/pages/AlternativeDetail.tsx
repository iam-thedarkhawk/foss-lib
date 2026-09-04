import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { AlternativeDetail as AlternativeDetailData } from "../types";

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

export default function AlternativeDetail() {
  const { id } = useParams();
  const [alternative, setAlternative] = useState<AlternativeDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getAlternative(id).then(setAlternative).catch((requestError) => {
      setError(requestError.message ?? "Could not load this alternative.");
    });
  }, [id]);

  if (error) {
    return <div className="max-w-3xl mx-auto px-6 py-10 font-mono text-sm text-rust">{error}</div>;
  }

  if (!alternative) {
    return <div className="max-w-3xl mx-auto px-6 py-10 font-mono text-sm text-ink/60">Loading entry...</div>;
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="font-mono text-xs text-pine underline underline-offset-4">
        ← Back to catalogue
      </Link>

      <div className="catalogue-card mt-8 p-6 md:p-8">
        <p className="font-mono text-xs text-pine mb-2">open source alternative</p>
        <h2 className="font-display text-4xl mb-4">{alternative.name}</h2>
        <p className="text-lg leading-relaxed text-ink/85">{alternative.description}</p>

        <div className="border-t border-ink/20 mt-8 pt-5 flex flex-wrap gap-2">
          <span className="tag-pill">{LICENSE_LABEL[alternative.license]}</span>
          {alternative.platforms.map((platform) => (
            <span key={platform} className="tag-pill">
              {platform.replace("_", " ").toLowerCase()}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href={alternative.repoUrl} target="_blank" rel="noreferrer" className="stamp-button inline-block">
            View repository ↗
          </a>
          {alternative.website && (
            <a href={alternative.website} target="_blank" rel="noreferrer" className="stamp-button inline-block bg-rust text-paper">
              Visit website ↗
            </a>
          )}
        </div>

        <div className="border-t border-ink/20 mt-8 pt-5">
          <p className="font-mono text-xs text-ink/60 mb-3">alternative to</p>
          <div className="flex flex-col gap-3">
            {alternative.apps.map((link) => (
              <div key={link.id}>
                <p className="font-display text-xl">{link.app.name}</p>
                {link.fitNotes && <p className="text-sm text-ink/60 italic mt-1">{link.fitNotes}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}