import type { AlternativeDetail, AlternativeListItem, Category, ProprietaryApp } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getCategories: () => request<Category[]>("/categories"),

  getApps: (params?: { category?: string; search?: string }, signal?: AbortSignal) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return request<ProprietaryApp[]>(`/apps${qs ? `?${qs}` : ""}`, { signal });
  },

  getAlternative: (id: string, signal?: AbortSignal) =>
    request<AlternativeDetail>(`/alternatives/${id}`, { signal }),

  getAlternatives: (params?: { category?: string; search?: string }, signal?: AbortSignal) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return request<AlternativeListItem[]>(`/alternatives${qs ? `?${qs}` : ""}`, { signal });
  },

  submit: (payload: {
    proprietaryName: string;
    alternativeName: string;
    alternativeRepoUrl: string;
    categoryGuess?: string;
    description: string;
    submitterEmail?: string;
  }) =>
    request("/submissions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
