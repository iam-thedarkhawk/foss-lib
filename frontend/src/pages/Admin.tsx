import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getCuratorToken, setCuratorToken } from "../api/client";
import type { Submission } from "../types";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<string>("PENDING");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Check if already authenticated on mount
  useEffect(() => {
    const existingToken = getCuratorToken();
    if (existingToken) {
      setIsVerifying(true);
      api
        .verifyCurator(existingToken)
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch(() => {
          setCuratorToken(null);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, []);

  function loadSubmissions() {
    setLoading(true);
    setError(null);
    api
      .getSubmissions(filter === "ALL" ? undefined : filter)
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message && err.message.includes("401")) {
          setCuratorToken(null);
          setIsAuthenticated(false);
          setLoginError("Your curator session has expired. Please enter the passkey again.");
        } else {
          setError(err.message || "Failed to load submissions.");
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated, filter]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setIsVerifying(true);
    try {
      await api.verifyCurator(passkeyInput.trim());
      setCuratorToken(passkeyInput.trim());
      setIsAuthenticated(true);
      setPasskeyInput("");
    } catch (err: any) {
      setLoginError(err.message || "Access denied. Invalid curator passkey.");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleLogout() {
    setCuratorToken(null);
    setIsAuthenticated(false);
    setSubmissions([]);
    setNotice(null);
  }

  async function handleStatusChange(id: string, status: "APPROVED" | "REJECTED") {
    setActionLoading(id);
    setNotice(null);
    try {
      await api.updateSubmission(id, status);
      setNotice(
        status === "APPROVED"
          ? "Submission successfully approved and indexed into the catalogue!"
          : "Submission marked as rejected."
      );
      loadSubmissions();
    } catch (err: any) {
      setError(err.message || "Failed to update submission status.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to permanently delete this submission from the ledger?")) {
      return;
    }
    setActionLoading(id);
    setNotice(null);
    try {
      await api.deleteSubmission(id);
      setNotice("Submission successfully removed from the ledger.");
      loadSubmissions();
    } catch (err: any) {
      setError(err.message || "Failed to delete submission.");
    } finally {
      setActionLoading(null);
    }
  }

  // --- Lock Screen (When not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <Link
          to="/"
          className="font-mono text-xs text-pine hover:text-ink underline underline-offset-4 inline-flex items-center gap-1 mb-6"
        >
          <span>← Back to public catalogue</span>
        </Link>

        <div className="catalogue-card p-8 border-2 border-ink shadow-card-deep">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-rust"></span>
            <p className="font-mono text-xs text-pine uppercase tracking-wider font-semibold">
              Restricted Curator Desk
            </p>
          </div>

          <h2 className="font-display text-3xl font-bold text-ink mb-2">
            Curator Authentication
          </h2>
          <p className="text-sm text-ink/75 mb-6 leading-relaxed">
            Only authorized curators can review, approve, or reject user-submitted alternatives.
            Please enter your curator passkey to proceed.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-ink/80 font-medium">
                Curator Passkey
              </span>
              <input
                type="password"
                required
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter secret passkey..."
                className="border-2 border-ink/60 px-3.5 py-2.5 bg-paper font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pine"
              />
            </label>

            {loginError && (
              <div className="p-3 bg-rust/10 border-2 border-rust text-rust font-mono text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="stamp-button !bg-pine !text-paper hover:!bg-pine/90 text-sm mt-2 disabled:opacity-50"
            >
              {isVerifying ? "Verifying Credentials..." : "Unlock Moderation Desk"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-ink/20 text-xs text-ink/50 font-mono">
            Default local passkey is set in backend <code className="text-ink">.env</code> (`ADMIN_TOKEN`).
          </div>
        </div>
      </div>
    );
  }

  // --- Unlocked Moderation Desk ---
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-pine"></span>
            <p className="font-mono text-xs text-pine uppercase tracking-wider font-semibold">
              curator workstation — authenticated
            </p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
            Submissions Review Queue
          </h1>
          <p className="text-sm text-ink/70 mt-1">
            Review community suggested alternatives. Approving an entry automatically
            promotes it into the live catalogue database.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-rust hover:text-ink underline px-2 py-1 border border-rust/30 hover:border-ink"
          >
            🔒 Lock Desk (Sign Out)
          </button>
          <Link to="/" className="stamp-button text-xs">
            ← Public Catalogue
          </Link>
        </div>
      </div>

      {notice && (
        <div className="p-4 bg-pine/15 border-2 border-pine text-pine font-mono text-sm mb-6 flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-xs underline">
            dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rust/15 border-2 border-rust text-rust font-mono text-sm mb-6">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b-2 border-ink/20 pb-4 mb-6">
        {["PENDING", "APPROVED", "REJECTED", "ALL"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`tag-pill !text-xs !py-1.5 !px-3 font-semibold ${
              filter === tab ? "!bg-ink !text-paper !border-ink" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-12 text-center font-mono text-sm text-ink/60 animate-pulse">
          Opening moderation desk...
        </div>
      )}

      {!loading && submissions.length === 0 && (
        <div className="p-10 text-center bg-card border border-ink/40 shadow-card">
          <p className="font-display text-2xl font-bold mb-2">
            No {filter.toLowerCase()} submissions
          </p>
          <p className="font-mono text-sm text-ink/60">
            The review desk is clear. New community entries will appear here.
          </p>
        </div>
      )}

      {!loading && submissions.length > 0 && (
        <div className="flex flex-col gap-6">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="catalogue-card p-6 border-2 border-ink shadow-card flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border font-bold ${
                        sub.status === "APPROVED"
                          ? "bg-pine text-paper border-pine"
                          : sub.status === "REJECTED"
                          ? "bg-rust text-paper border-rust"
                          : "bg-amber text-ink border-amber"
                      }`}
                    >
                      {sub.status}
                    </span>
                    <span className="font-mono text-xs text-ink/50">
                      Filed {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                    {sub.categoryGuess && (
                      <span className="tag-pill text-[10px]">{sub.categoryGuess}</span>
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    {sub.alternativeName}{" "}
                    <span className="font-body text-base font-normal text-ink/60">
                      as alternative for
                    </span>{" "}
                    <span className="text-rust">{sub.proprietaryName}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {sub.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(sub.id, "APPROVED")}
                        disabled={actionLoading === sub.id}
                        className="stamp-button text-xs !bg-pine !text-paper hover:!bg-pine/90 disabled:opacity-50"
                      >
                        {actionLoading === sub.id ? "Processing..." : "Approve & Index"}
                      </button>
                      <button
                        onClick={() => handleStatusChange(sub.id, "REJECTED")}
                        disabled={actionLoading === sub.id}
                        className="stamp-button text-xs !bg-rust/20 hover:!bg-rust hover:!text-paper text-rust disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {sub.status !== "PENDING" && (
                    <span className="font-mono text-xs text-ink/50 italic mr-2">
                      Status finalized
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(sub.id)}
                    disabled={actionLoading === sub.id}
                    className="font-mono text-[11px] text-rust/70 hover:text-rust underline p-1"
                    title="Delete record from ledger"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="bg-paper/70 p-4 border border-ink/20 text-sm text-ink/85 leading-relaxed">
                <p className="font-mono text-xs text-ink/60 uppercase mb-1 font-semibold">
                  Submitter Notes:
                </p>
                {sub.description}
              </div>

              <div className="flex items-center justify-between border-t border-ink/10 pt-3 text-xs flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={sub.alternativeRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-pine hover:text-ink underline"
                  >
                    Repository Link ↗
                  </a>
                  {sub.alternativeWebsite && (
                    <a
                      href={sub.alternativeWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-rust hover:text-ink underline font-medium"
                    >
                      Official Website ↗
                    </a>
                  )}
                  {sub.submitterEmail && (
                    <span className="font-mono text-ink/50">
                      Submitter: {sub.submitterEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
