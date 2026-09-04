import { useState } from "react";
import { api } from "../api/client";

const initialForm = {
  proprietaryName: "",
  alternativeName: "",
  alternativeRepoUrl: "",
  categoryGuess: "",
  description: "",
  submitterEmail: "",
};

export default function Submit() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      await api.submit(form);
      setStatus("done");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="font-mono text-xs text-pine mb-2">entry filed</p>
        <h2 className="font-display text-3xl mb-3">Thanks for the submission.</h2>
        <p className="text-ink/70">
          It's in the review queue now. Once approved, it'll appear in the catalogue.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="stamp-button mt-8"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-pine mb-2">new catalogue entry</p>
      <h2 className="font-display text-3xl mb-6">Submit an alternative</h2>

      <form onSubmit={handleSubmit} className="catalogue-card p-6 flex flex-col gap-5">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink/70">Proprietary app it replaces</span>
          <input
            required
            value={form.proprietaryName}
            onChange={(e) => update("proprietaryName", e.target.value)}
            placeholder="e.g. Photoshop"
            className="border border-ink/50 px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink/70">FOSS alternative name</span>
          <input
            required
            value={form.alternativeName}
            onChange={(e) => update("alternativeName", e.target.value)}
            placeholder="e.g. GIMP"
            className="border border-ink/50 px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink/70">Repository URL</span>
          <input
            required
            type="url"
            value={form.alternativeRepoUrl}
            onChange={(e) => update("alternativeRepoUrl", e.target.value)}
            placeholder="https://github.com/..."
            className="border border-ink/50 px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink/70">Category (optional guess)</span>
          <input
            value={form.categoryGuess}
            onChange={(e) => update("categoryGuess", e.target.value)}
            placeholder="e.g. Design"
            className="border border-ink/50 px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink/70">Why is it a good alternative?</span>
          <textarea
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="border border-ink/50 px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink/70">Your email (optional)</span>
          <input
            type="email"
            value={form.submitterEmail}
            onChange={(e) => update("submitterEmail", e.target.value)}
            placeholder="in case we have questions"
            className="border border-ink/50 px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        {status === "error" && (
          <p className="font-mono text-sm text-rust">{errorMsg}</p>
        )}

        <button type="submit" disabled={status === "submitting"} className="stamp-button self-start">
          {status === "submitting" ? "Filing..." : "File entry"}
        </button>
      </form>
    </div>
  );
}
