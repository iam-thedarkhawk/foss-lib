import type { Category } from "../types";

interface Props {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search the catalogue, e.g. GIMP, Inkscape, Notion..."
        className="w-full bg-card border border-ink/70 px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-pine"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`tag-pill !text-xs !py-1 !px-3 ${
            activeCategory === null ? "bg-ink text-paper" : ""
          }`}
        >
          all categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={`tag-pill !text-xs !py-1 !px-3 ${
              activeCategory === cat.slug ? "bg-ink text-paper" : ""
            }`}
          >
            {cat.name.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
