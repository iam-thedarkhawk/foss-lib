import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { Category, ProprietaryApp } from "../types";
import FilterBar from "../components/FilterBar";
import AppCard from "../components/AppCard";

export default function Catalogue() {
  const [apps, setApps] = useState<ProprietaryApp[]>([]);
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
      api
        .getApps(
          { category: activeCategory ?? undefined, search: search || undefined },
          controller.signal
        )
        .then(setApps)
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
  }, [activeCategory, search]);

  const emptyState = useMemo(
    () => !loading && !error && apps.length === 0,
    [loading, error, apps]
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
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
