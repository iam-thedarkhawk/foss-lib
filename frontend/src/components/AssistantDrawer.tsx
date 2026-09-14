import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { AlternativeListItem, ChatMessage } from "../types";

const STARTER_PROMPTS = [
  "Replace Photoshop for photo retouching and digital art",
  "Looking for a self-hosted team chat like Slack or Teams",
  "Offline note-taking app with markdown like Notion or Evernote",
  "Free and open-source video editor for YouTube clips on Linux",
  "Privacy-focused cloud storage with end-to-end encryption",
  "Offline REST/GraphQL API client to replace Postman",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Greetings! I am **The Reference Librarian** at FOSSLib. Tell me about your workflow, operating system, or commercial software you wish to replace, and I will search our catalogue for the most fitting open-source alternatives.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export default function AssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem("fosslib_assistant_history");
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage error
    }
    return [INITIAL_MESSAGE];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem("fosslib_assistant_history", JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSend(textToSend?: string) {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const conversationPayload = newHistory
        .filter((m) => m.id !== "greeting")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.chatWithAssistant(conversationPayload);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        recommendedAlternatives: res.recommendedAlternatives || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || "The librarian could not be reached. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    try {
      sessionStorage.removeItem("fosslib_assistant_history");
    } catch {
      // Ignore
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating Stamp Launcher */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="stamp-button !bg-ink !text-paper hover:!bg-pine shadow-card-hover flex items-center gap-2.5 py-3 px-5 border-2 border-ink text-sm sm:text-base group transition-transform"
          aria-label="Ask the Reference Librarian"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">📖</span>
          <span className="font-display font-semibold">Ask the Librarian</span>
          <span className="bg-rust text-paper text-[10px] font-mono uppercase px-1.5 py-0.2 rounded-none font-bold">
            AI
          </span>
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:max-w-lg md:max-w-xl bg-paper border-l-2 border-ink z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="border-b-2 border-ink p-5 bg-card flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-rust"></span>
              <p className="font-mono text-xs text-pine uppercase tracking-wider font-semibold">
                reference desk — catalogue assistant
              </p>
            </div>
            <h2 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
              <span>The Reference Librarian</span>
            </h2>
            <p className="text-xs text-ink/70 mt-1">
              Grounded in FOSSLib's collection of 85+ open-source alternatives.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="font-mono text-[11px] text-ink/60 hover:text-rust underline px-2 py-1"
              title="Reset conversation"
            >
              Reset Desk
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center border-2 border-ink text-ink hover:bg-ink hover:text-paper font-bold text-lg"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] catalogue-card p-4 sm:p-5 flex flex-col gap-2 ${
                  msg.role === "user"
                    ? "!bg-ink !text-paper !border-ink shadow-sm"
                    : "!bg-card !border-ink/80 shadow-card"
                }`}
              >
                <div
                  className={`flex items-center justify-between gap-3 text-[11px] font-mono border-b pb-1.5 ${
                    msg.role === "user"
                      ? "border-paper/20 text-paper/70"
                      : "border-ink/15 text-pine font-medium"
                  }`}
                >
                  <span className="font-semibold uppercase tracking-wider">
                    {msg.role === "user" ? "Your Inquiry" : "The Librarian"}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Formatted Content */}
                <div
                  className={`text-sm leading-relaxed whitespace-pre-line font-body ${
                    msg.role === "user" ? "text-paper" : "text-ink"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Embedded Recommended Alternative Cards */}
                {msg.recommendedAlternatives && msg.recommendedAlternatives.length > 0 && (
                  <div className="mt-3 pt-3 border-t-2 border-ink/20 flex flex-col gap-2.5">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-pine font-bold flex items-center gap-1.5">
                      <span>🏷️</span> Catalogued Recommendations ({msg.recommendedAlternatives.length}):
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendedAlternatives.map((alt: AlternativeListItem) => (
                        <div
                          key={alt.id}
                          className="p-3 bg-paper border border-ink/40 flex flex-col gap-1.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <Link
                              to={`/alternatives/${alt.id}`}
                              onClick={() => setIsOpen(false)}
                              className="font-display font-bold text-base underline decoration-rust decoration-2 hover:text-rust text-ink"
                            >
                              {alt.name}
                            </Link>
                            <div className="flex items-center gap-1">
                              <span className="tag-pill font-bold !text-[10px]">
                                {alt.license}
                              </span>
                              {alt.stars ? (
                                <span className="font-mono text-[10px] text-amber">
                                  ★ {alt.stars.toLocaleString()}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <p className="text-xs text-ink/80 line-clamp-2">
                            {alt.description}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <div className="flex items-center gap-1 flex-wrap">
                              {alt.platforms.slice(0, 3).map((p) => (
                                <span
                                  key={p}
                                  className="text-[9px] font-mono px-1 py-0.2 bg-card border border-ink/20 text-ink/70"
                                >
                                  {p.toLowerCase()}
                                </span>
                              ))}
                            </div>

                            <Link
                              to={`/alternatives/${alt.id}`}
                              onClick={() => setIsOpen(false)}
                              className="font-mono font-semibold text-pine hover:text-rust underline"
                            >
                              Inspect card →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Starter suggestions if only 1 greeting message */}
          {messages.length === 1 && (
            <div className="mt-2 flex flex-col gap-2">
              <p className="font-mono text-xs text-ink/60 uppercase tracking-wider">
                Common Inquiries & Prompts:
              </p>
              <div className="flex flex-col gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs font-body p-2.5 bg-card hover:bg-paper border border-ink/30 hover:border-ink transition-colors shadow-sm"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="self-start catalogue-card p-4 !bg-card border border-ink/50 shadow-sm flex items-center gap-2">
              <span className="animate-spin text-sm">⏳</span>
              <p className="font-mono text-xs text-ink/70 animate-pulse">
                Consulting the library catalogues and filing notes...
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rust/10 border-2 border-rust text-rust font-mono text-xs">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t-2 border-ink p-4 bg-card flex flex-col gap-2">
          <div className="flex gap-2 items-end">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your workflow, preferred OS, or commercial tool to replace (Enter to send)..."
              disabled={isLoading}
              className="flex-1 bg-paper border-2 border-ink/70 p-2.5 font-body text-sm text-ink placeholder:text-ink/45 focus:outline-none focus:ring-2 focus:ring-pine resize-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="stamp-button !bg-pine !text-paper hover:!bg-pine/90 disabled:opacity-50 py-3 px-4 text-xs font-mono uppercase font-bold"
            >
              Send
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-ink/50 px-1">
            <span>Shift+Enter for newline</span>
            <span>Powered by Gemini</span>
          </div>
        </div>
      </div>
    </>
  );
}
