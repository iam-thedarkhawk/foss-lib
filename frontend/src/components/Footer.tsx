import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink mt-20 bg-paper/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-pine uppercase font-semibold tracking-wider">
            colophon & contributions
          </span>
          <div className="h-px bg-ink/20 flex-1"></div>
        </div>
        <p className="text-sm text-ink/80 max-w-2xl leading-relaxed">
          Know a free and open-source alternative that isn't catalogued yet?{" "}
          <Link
            to="/submit"
            className="underline decoration-rust decoration-2 underline-offset-2 font-semibold text-ink hover:text-rust"
          >
            Submit an entry here
          </Link>{" "}
          and it will land in the review queue. Prefer submitting via pull request
          or extending the schema? Fork the project and contribute on GitHub.
        </p>
        <div className="flex items-center gap-4 flex-wrap pt-2">
          <a
            href="https://github.com/iam-thedarkhawk/foss-lib"
            target="_blank"
            rel="noreferrer"
            className="stamp-button text-sm"
          >
            <span>View GitHub Repository ↗</span>
          </a>
          <Link to="/admin" className="font-mono text-xs text-ink/60 hover:text-ink underline">
            Admin Submissions Desk
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-ink/10 pt-6 text-xs text-ink/50 gap-2">
          <p>FOSSLib — Free & Open Source Software Library Index.</p>
          <p className="font-mono">Curated by the community. Released under MIT.</p>
        </div>
      </div>
    </footer>
  );
}
