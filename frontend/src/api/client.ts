import type {
  AlternativeDetail,
  AlternativeListItem,
  Category,
  ProprietaryApp,
  Submission,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "fosslib_curator_token";

export function getCuratorToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setCuratorToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage issues
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getCuratorToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getCategories: () => request<Category[]>("/categories"),

  getApps: (
    params?: { category?: string; search?: string; platform?: string },
    signal?: AbortSignal
  ) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.platform) query.set("platform", params.platform);
    const qs = query.toString();
    return request<ProprietaryApp[]>(`/apps${qs ? `?${qs}` : ""}`, { signal });
  },

  getAlternative: (id: string, signal?: AbortSignal) =>
    request<AlternativeDetail>(`/alternatives/${id}`, { signal }),

  getAlternatives: (
    params?: { category?: string; search?: string; platform?: string },
    signal?: AbortSignal
  ) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.platform) query.set("platform", params.platform);
    const qs = query.toString();
    return request<AlternativeListItem[]>(`/alternatives${qs ? `?${qs}` : ""}`, { signal });
  },

  submit: (payload: {
    proprietaryName: string;
    alternativeName: string;
    alternativeRepoUrl: string;
    alternativeWebsite?: string;
    categoryGuess?: string;
    description: string;
    submitterEmail?: string;
  }) =>
    request<Submission>("/submissions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyCurator: (token: string) =>
    fetch(`${BASE_URL}/submissions/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Invalid curator passkey.");
      }
      return res.json();
    }),

  getSubmissions: (status?: string, signal?: AbortSignal) => {
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    return request<Submission[]>(`/submissions${qs}`, { signal });
  },

  updateSubmission: (id: string, status: "APPROVED" | "REJECTED") =>
    request<Submission>(`/submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteSubmission: (id: string) =>
    request<{ ok: boolean; message: string }>(`/submissions/${id}`, {
      method: "DELETE",
    }),
};
