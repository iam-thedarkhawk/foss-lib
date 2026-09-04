import { Link } from "react-router-dom";
import type { AlternativeListItem } from "../types";

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

export default function AlternativeCard({ alternative }: { alternative: AlternativeListItem }) {
  return (
    <article className="catalogue-card p-5 flex flex-col gap-4">
      <div>
        <p className="font-mono text-[11px] text-pine mb-1">open source alternative</p>
        <Link
          to={`/alternatives/${alternative.id}`}
          className="font-display text-2xl underline decoration-rust decoration-2 underline-offset-2"
        >
          {alternative.name}
        </Link>
        <p className="text-sm text-ink/80 mt-2">{alternative.description}</p>
      </div>

      <div className="border-t border-ink/20 pt-3 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="tag-pill">{LICENSE_LABEL[alternative.license]}</span>
          {alternative.platforms.map((platform) => (
            <span key={platform} className="tag-pill">
              {platform.replace("_", " ").toLowerCase()}
            </span>
          ))}
        </div>
        <div>
          <p className="font-mono text-[11px] text-ink/60 mb-1">alternative to</p>
          <p className="text-sm">
            {alternative.apps.map((link) => link.app.name).join(", ") || "Catalogue entry"}
          </p>
        </div>
      </div>
    </article>
  );
}