import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { Category, ProprietaryApp } from "../types";
import FilterBar from "../components/FilterBar";
import AppCard from "../components/AppCard";
import AlternativeCard from "../components/AlternativeCard";

type CatalogueView = "alternatives" | "apps";

export default function Catalogue() {
  const [apps, setApps] = useState<ProprietaryApp[]>([]);
  const [alternatives, setAlternatives] = useState<Awaited<ReturnType<typeof api.getAlternatives>>>([]);
  const [view, setView] = useState<CatalogueView>("alternatives");
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(() => {
        /* categories are optional decoration; fail quietly */
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      const request = view === "alternatives"
        ? api.getAlternatives(
            { category: activeCategory ?? undefined, search: search || undefined },
            controller.signal
          ).then(setAlternatives)
        : api.getApps(
            { category: activeCategory ?? undefined, search: search || undefined },
            controller.signal
          ).then(setApps);

      request
        .catch((e) => {
          if (e instanceof DOMException && e.name === "AbortError") return;
          setError(e.message ?? "Could not load the catalogue.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250); // debounce search input

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [activeCategory, search, view]);

  const emptyState = useMemo(
    () => !loading && !error && (view === "alternatives" ? alternatives.length : apps.length) === 0,
    [loading, error, alternatives, apps, view]
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="flex gap-1 border-b border-ink/30 mb-8">
        <button
          onClick={() => setView("alternatives")}
          className={`font-mono text-xs px-4 py-2 border border-b-0 ${
            view === "alternatives" ? "bg-ink text-paper border-ink" : "border-transparent"
          }`}
        >
          alternatives
        </button>
        <button
          onClick={() => setView("apps")}
          className={`font-mono text-xs px-4 py-2 border border-b-0 ${
            view === "apps" ? "bg-ink text-paper border-ink" : "border-transparent"
          }`}
        >
          proprietary apps
        </button>
      </div>

      {loading && <p className="font-mono text-sm text-ink/60">Pulling the drawer open...</p>}

      {error && (
        <p className="font-mono text-sm text-rust">
          Couldn't reach the backend: {error}. Is the API running on :4000?
        </p>
      )}

      {emptyState && (
        <p className="font-mono text-sm text-ink/60">
          No entries match yet. Try a different search, or submit one.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {view === "alternatives"
          ? alternatives.map((alternative) => (
              <AlternativeCard key={alternative.id} alternative={alternative} />
            ))
          : apps.map((app) => <AppCard key={app.id} app={app} />)}
      </div>
    </div>
  );
}
