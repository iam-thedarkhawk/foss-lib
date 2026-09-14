import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../db.js";

const router = Router();

interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

// In-memory cache for catalogue summary to avoid querying DB on every message
let cachedCatalogueContext = "";
let cachedAlternativesMap = new Map<string, any>();
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getCatalogueContext() {
  const now = Date.now();
  if (cachedCatalogueContext && now - lastCacheTime < CACHE_TTL_MS) {
    return { context: cachedCatalogueContext, alternativesMap: cachedAlternativesMap };
  }

  try {
    const alternatives = await prisma.fossAlternative.findMany({
      include: {
        apps: {
          include: {
            app: {
              include: { category: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const lines: string[] = [];
    const map = new Map<string, any>();

    for (const alt of alternatives) {
      const formattedAlt = {
        ...alt,
        platforms: alt.platforms ? alt.platforms.split(",").map((p) => p.trim()) : [],
      };
      map.set(alt.id, formattedAlt);
      map.set(alt.name.toLowerCase(), formattedAlt);

      const replaced = alt.apps.map((a) => a.app.name).join(", ") || "General Tool";
      const categories = [
        ...new Set(alt.apps.map((a) => a.app.category.name).filter(Boolean)),
      ].join(", ") || "Software";
      const fit = alt.apps.map((a) => a.fitNotes).filter(Boolean).join("; ");

      lines.push(
        `- [ID: ${alt.id}] "${alt.name}" | Category: ${categories} | License: ${alt.license} | Platforms: ${alt.platforms} | Replaces: ${replaced} | Overview: ${alt.description}${fit ? ` | Fit notes: ${fit}` : ""}`
      );
    }

    cachedCatalogueContext = lines.join("\n");
    cachedAlternativesMap = map;
    lastCacheTime = now;

    return { context: cachedCatalogueContext, alternativesMap: cachedAlternativesMap };
  } catch (error) {
    console.warn("Could not query DB for assistant context:", error);
    return { context: "", alternativesMap: new Map() };
  }
}

// POST /api/assistant/chat
router.post("/chat", async (req, res) => {
  const { messages } = req.body as { messages?: ChatMessageInput[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Graceful fallback if no API key is set yet
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key") {
    return res.json({
      message:
        "Welcome to the Reference Desk! 📖\n\nAI recommendations are currently in standby because `GEMINI_API_KEY` is not yet configured in `backend/.env`.\n\nPlease add your Gemini API key to `backend/.env` to enable real-time conversational recommendations. In the meantime, you can search and browse all alternatives directly in the catalogue!",
      recommendedAlternatives: [],
      apiKeyMissing: true,
    });
  }

  try {
    const { context, alternativesMap } = await getCatalogueContext();

    const systemInstruction = `You are "The Reference Librarian" at FOSSLib (Free & Open Source Software Library).
Your mission is to guide users to the most suitable free and open-source alternatives for their specific workflow, operating system, and use case.

Tone & Style:
- Thoughtful, erudite, warm, and objective—like a helpful librarian at a grand university or historical archives.
- Clear, concise, and structured. Use markdown formatting (bullet points, bold text).
- Be completely honest about trade-offs, learning curves, format compatibility, or missing cloud features.
- If a user specifies an operating system (e.g. Linux, macOS, Windows), prioritize tools that support that platform.

Catalogue Knowledge:
Below is the verified list of tools currently in FOSSLib's catalogue:
${context}

Instructions:
1. Always prioritize recommending tools that are in FOSSLib's catalogue.
2. For each recommendation, explain *why* it fits the user's specific use case, mention its license and platform compatibility, and highlight any trade-offs.
3. If the user mentions proprietary software (e.g., Photoshop, Notion, Slack, AutoCAD, Office), connect them to the specific FOSS replacement.
4. At the very end of your response, on its own single line, include the exact catalogue IDs of the tools you recommended from the list above in this format:
RECOMMENDED_IDS: id1, id2
(If you did not recommend any tool from the catalogue, omit this line entirely).`;

    const ai = new GoogleGenAI({ apiKey });

    // Format chat history for Gemini SDK
    // Keep last 10 messages for conversation continuity
    const recentMessages = messages.slice(-10);
    const contents = recentMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const candidateModels = ["gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-3.7-flash"];
    let response: any = null;
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next candidate...`, err?.message?.slice(0, 100));
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All candidate Gemini models were unavailable.");
    }

    const rawReply = response.text || "I was unable to pull a catalogue record at this time.";

    // Parse RECOMMENDED_IDS from the output
    let cleanReply = rawReply;
    const recommendedAlternatives: any[] = [];
    const recommendedIdsMatch = rawReply.match(/RECOMMENDED_IDS:\s*([^\n\r]+)/i);

    if (recommendedIdsMatch) {
      cleanReply = rawReply.replace(/RECOMMENDED_IDS:\s*([^\n\r]+)/i, "").trim();
      const rawIds = recommendedIdsMatch[1]
        .split(",")
        .map((s: string) => s.trim().replace(/^\[|\]$/g, ""))
        .filter(Boolean);

      const seen = new Set<string>();
      for (const id of rawIds) {
        const alt = alternativesMap.get(id) || alternativesMap.get(id.toLowerCase());
        if (alt && !seen.has(alt.id)) {
          seen.add(alt.id);
          recommendedAlternatives.push(alt);
        }
      }
    }

    res.json({
      message: cleanReply,
      recommendedAlternatives,
    });
  } catch (error: any) {
    console.error("Error generating assistant response:", error);

    let userMessage = "The Reference Librarian is currently unable to consult the archives. Please try again in a moment.";
    const errMsg = String(error?.message || "");

    if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand")) {
      userMessage = "The Reference Desk is experiencing high demand with Google Gemini right now. Please try again in a moment!";
    } else if (errMsg.includes("API_KEY_SERVICE_BLOCKED") || errMsg.includes("401") || errMsg.includes("UNAUTHENTICATED")) {
      userMessage = "The configured Gemini API key is invalid or has been blocked by Google Security. Please generate a fresh API key from Google AI Studio (https://aistudio.google.com/app/apikey) and update GEMINI_API_KEY in your settings.";
    }

    res.status(500).json({
      error: userMessage,
    });
  }
});

export default router;
