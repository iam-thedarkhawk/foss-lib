import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const initialForm = {
  proprietaryName: "",
  alternativeName: "",
  alternativeRepoUrl: "",
  alternativeWebsite: "",
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
      setErrorMsg(err instanceof Error ? err.message : "Submission could not be recorded.");
    }
  }

  if (status === "done") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="catalogue-card p-8 sm:p-12 border-2 border-ink shadow-card-deep">
          <span className="font-mono text-xs uppercase tracking-widest text-pine font-bold block mb-2">
            entry recorded in ledger
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-ink">
            Thank you for your contribution.
          </h2>
          <p className="text-ink/75 leading-relaxed max-w-md mx-auto">
            Your suggested alternative has been submitted to the review queue. Once
            moderated and approved, it will be immediately indexed into the public catalogue.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setStatus("idle")}
              className="stamp-button text-sm"
            >
              Submit Another Entry
            </button>
            <Link to="/" className="stamp-button text-sm !bg-pine !text-paper">
              Browse Catalogue Index
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        to="/"
        className="font-mono text-xs text-pine hover:text-ink underline underline-offset-4 inline-flex items-center gap-1 mb-6"
      >
        <span>← Back to catalogue index</span>
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-rust"></span>
          <p className="font-mono text-xs text-pine uppercase tracking-wider font-semibold">
            index contribution form
          </p>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
          Submit an Open Source Alternative
        </h1>
        <p className="text-sm text-ink/70 mt-1.5 leading-relaxed">
          Help build a comprehensive free-software reference index. Entries will be reviewed
          and added to the public catalogue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="catalogue-card p-6 sm:p-8 border-2 border-ink shadow-card flex flex-col gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-ink/80 font-medium">
            1. Proprietary software being replaced <span className="text-rust font-bold">*</span>
          </span>
          <input
            required
            value={form.proprietaryName}
            onChange={(e) => update("proprietaryName", e.target.value)}
            placeholder="e.g. Adobe Photoshop, Microsoft Teams, AutoCAD..."
            className="border-2 border-ink/60 px-3.5 py-2.5 bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-ink/80 font-medium">
            2. FOSS alternative name <span className="text-rust font-bold">*</span>
          </span>
          <input
            required
            value={form.alternativeName}
            onChange={(e) => update("alternativeName", e.target.value)}
            placeholder="e.g. GIMP, Zulip, FreeCAD..."
            className="border-2 border-ink/60 px-3.5 py-2.5 bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        {/* Repository & Website Links placed adjacent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-ink/80 font-medium">
              3. Source repository URL <span className="text-rust font-bold">*</span>
            </span>
            <input
              required
              type="url"
              value={form.alternativeRepoUrl}
              onChange={(e) => update("alternativeRepoUrl", e.target.value)}
              placeholder="https://github.com/... or gitlab"
              className="border-2 border-ink/60 px-3.5 py-2.5 bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-pine"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-ink/80 font-medium">
              4. Official website URL (optional)
            </span>
            <input
              type="url"
              value={form.alternativeWebsite}
              onChange={(e) => update("alternativeWebsite", e.target.value)}
              placeholder="https://example.org"
              className="border-2 border-ink/60 px-3.5 py-2.5 bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-pine"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-ink/80 font-medium">
            5. Suggested category (optional)
          </span>
          <input
            value={form.categoryGuess}
            onChange={(e) => update("categoryGuess", e.target.value)}
            placeholder="e.g. Design & Graphics, Office Suites, Communication..."
            className="border-2 border-ink/60 px-3.5 py-2.5 bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-ink/80 font-medium">
            6. Why is this a strong alternative? Notes & features <span className="text-rust font-bold">*</span>
          </span>
          <textarea
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="Explain key feature parity, differences, format compatibility, or self-hosting requirements..."
            className="border-2 border-ink/60 px-3.5 py-2.5 bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-ink/80 font-medium">
            7. Your email (optional)
          </span>
          <input
            type="email"
            value={form.submitterEmail}
            onChange={(e) => update("submitterEmail", e.target.value)}
            placeholder="In case we need clarification on licenses or links"
            className="border-2 border-ink/60 px-3.5 py-2.5 bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </label>

        {status === "error" && (
          <div className="p-3 bg-rust/10 border-2 border-rust text-rust font-mono text-sm">
            {errorMsg}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="stamp-button !bg-pine !text-paper hover:!bg-pine/90 text-sm disabled:opacity-50"
          >
            {status === "submitting" ? "Filing in Ledger..." : "Submit to Review Queue"}
          </button>
        </div>
      </form>
    </div>
  );
}
