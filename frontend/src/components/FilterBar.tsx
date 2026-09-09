import type { Category } from "../types";

const PLATFORMS = [
  { label: "Linux", value: "LINUX" },
  { label: "macOS", value: "MACOS" },
  { label: "Windows", value: "WINDOWS" },
  { label: "Web", value: "WEB" },
  { label: "Android", value: "ANDROID" },
  { label: "iOS", value: "IOS" },
  { label: "Self-Hosted", value: "SELF_HOSTED" },
];

interface Props {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
  activePlatform: string | null;
  onPlatformChange: (platform: string | null) => void;
  view: "alternatives" | "apps";
  onViewChange: (view: "alternatives" | "apps") => void;
  totalCount: number;
}

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  activePlatform,
  onPlatformChange,
  view,
  onViewChange,
  totalCount,
}: Props) {
  return (
    <div className="flex flex-col gap-5 mb-8">
      {/* Search Input Box */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search catalogue by name, keyword, or software replaced (e.g. GIMP, Notion, Office, Photoshop)..."
          className="w-full bg-card border-2 border-ink/80 px-4 py-3.5 pl-11 font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-pine shadow-card"
        />
        <span className="absolute left-3.5 top-3.5 text-ink/50 text-lg select-none">
          🔍
        </span>
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-3 text-xs font-mono text-ink/50 hover:text-ink px-1.5 py-0.5 border border-ink/20"
          >
            clear
          </button>
        )}
      </div>

      {/* View Switcher & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-ink/30 pb-3 gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => onViewChange("alternatives")}
            className={`font-mono text-xs uppercase px-4 py-2 border font-medium transition-all ${
              view === "alternatives"
                ? "bg-ink text-paper border-ink shadow-sm"
                : "bg-paper text-ink/70 border-ink/30 hover:border-ink/70"
            }`}
          >
            FOSS Alternatives
          </button>
          <button
            onClick={() => onViewChange("apps")}
            className={`font-mono text-xs uppercase px-4 py-2 border font-medium transition-all ${
              view === "apps"
                ? "bg-ink text-paper border-ink shadow-sm"
                : "bg-paper text-ink/70 border-ink/30 hover:border-ink/70"
            }`}
          >
            Proprietary Apps
          </button>
        </div>

        <div className="font-mono text-xs text-ink/60">
          Showing <span className="font-bold text-ink">{totalCount}</span> entries
          {activeCategory ? ` in selected category` : ""}
          {activePlatform ? ` on ${activePlatform.toLowerCase()}` : ""}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-col gap-2">
        <div className="font-mono text-[11px] text-ink/60 uppercase tracking-wider">
          Filter by Category:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onCategoryChange(null)}
            className={`tag-pill !text-xs !py-1 !px-3 ${
              activeCategory === null
                ? "!bg-ink !text-paper !border-ink font-semibold"
                : ""
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`tag-pill !text-xs !py-1 !px-3 ${
                activeCategory === cat.slug
                  ? "!bg-ink !text-paper !border-ink font-semibold"
                  : ""
              }`}
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Pills */}
      <div className="flex flex-col gap-2">
        <div className="font-mono text-[11px] text-ink/60 uppercase tracking-wider">
          Filter by Platform:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onPlatformChange(null)}
            className={`tag-pill !text-[11px] !py-0.5 !px-2.5 ${
              activePlatform === null
                ? "!bg-pine !text-paper !border-pine font-semibold"
                : ""
            }`}
          >
            Any Platform
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              onClick={() =>
                onPlatformChange(activePlatform === p.value ? null : p.value)
              }
              className={`tag-pill !text-[11px] !py-0.5 !px-2.5 ${
                activePlatform === p.value
                  ? "!bg-pine !text-paper !border-pine font-semibold"
                  : ""
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
