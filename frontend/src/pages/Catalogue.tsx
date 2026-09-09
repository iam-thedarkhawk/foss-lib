import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { Category, ProprietaryApp, AlternativeListItem } from "../types";
import FilterBar from "../components/FilterBar";
import AppCard from "../components/AppCard";
import AlternativeCard from "../components/AlternativeCard";

type CatalogueView = "alternatives" | "apps";

export default function Catalogue() {
  const [apps, setApps] = useState<ProprietaryApp[]>([]);
  const [alternatives, setAlternatives] = useState<AlternativeListItem[]>([]);
  const [view, setView] = useState<CatalogueView>("alternatives");
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch((err) => {
        console.warn("Could not load categories:", err);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      const params = {
        category: activeCategory ?? undefined,
        search: search ? search.trim() : undefined,
        platform: activePlatform ?? undefined,
      };

      const request =
        view === "alternatives"
          ? api.getAlternatives(params, controller.signal).then(setAlternatives)
          : api.getApps(params, controller.signal).then(setApps);

      request
        .catch((e) => {
          if (e instanceof DOMException && e.name === "AbortError") return;
          setError(e.message ?? "Could not retrieve records from the index.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 200);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [activeCategory, activePlatform, search, view]);

  const totalCount = useMemo(() => {
    return view === "alternatives" ? alternatives.length : apps.length;
  }, [view, alternatives, apps]);

  const emptyState = useMemo(
    () => !loading && !error && totalCount === 0,
    [loading, error, totalCount]
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Intro Banner */}
      <div className="mb-8 p-6 bg-card border-2 border-ink shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">
            Free & Open Source Alternatives Library
          </h2>
          <p className="text-sm text-ink/80 mt-1 max-w-xl">
            A curated reference index to help individuals and organizations replace
            closed, proprietary software with ethical, transparent, and self-hostable tools.
          </p>
        </div>
      </div>

      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activePlatform={activePlatform}
        onPlatformChange={setActivePlatform}
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
        totalCount={totalCount}
      />

      {loading && (
        <div className="py-16 text-center">
          <p className="font-mono text-sm text-ink/70 animate-pulse">
            Pulling drawer open and sorting catalogue cards...
          </p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-rust/10 border-2 border-rust text-rust my-6">
          <p className="font-mono font-semibold text-sm">
            Could not reach catalogue server: {error}
          </p>
          <p className="text-xs text-rust/80 mt-1">
            Ensure the backend API is running on port 4000 (`npm run dev` in backend directory).
          </p>
        </div>
      )}

      {emptyState && (
        <div className="py-16 text-center bg-card border border-ink/40 p-8 shadow-card">
          <p className="font-display text-2xl font-semibold mb-2">
            No catalogue entries found
          </p>
          <p className="font-mono text-sm text-ink/65 max-w-md mx-auto mb-6">
            We couldn't find any entries matching your current filters.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setActiveCategory(null);
                setActivePlatform(null);
                setSearch("");
              }}
              className="stamp-button text-xs"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {!loading && !error && totalCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {view === "alternatives"
            ? alternatives.map((alternative) => (
                <AlternativeCard
                  key={alternative.id}
                  alternative={alternative}
                />
              ))
            : apps.map((app) => <AppCard key={app.id} app={app} />)}
        </div>
      )}
    </div>
  );
}
