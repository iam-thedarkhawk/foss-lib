export default function Footer() {
  return (
    <footer className="border-t-2 border-ink mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-3">
        <p className="font-mono text-xs text-pine">contribute</p>
        <p className="text-sm text-ink/80 max-w-2xl">
          Know a FOSS alternative that isn't listed?{" "}
          <a href="/submit" className="underline decoration-rust decoration-2 underline-offset-2 font-semibold">
            Submit it here
          </a>{" "}
          and it'll go into the review queue. Prefer working in code — fixing a
          license, editing the schema, or improving the site itself? Fork the
          repo and open a merge request on GitHub.
        </p>
        <a
          href="https://github.com/iam-thedarkhawk/foss-lib"
          target="_blank"
          rel="noreferrer"
          className="stamp-button self-start text-sm"
        >
          Open a merge request on GitHub
        </a>
        <p className="text-xs text-ink/50 mt-2">
          See CONTRIBUTING.md in the repo for the full contribution guide.
        </p>
      </div>
    </footer>
  );
}
