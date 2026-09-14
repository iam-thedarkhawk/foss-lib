import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import categoriesRouter from "./routes/categories.js";
import appsRouter from "./routes/apps.js";
import alternativesRouter from "./routes/alternatives.js";
import submissionsRouter from "./routes/submissions.js";
import assistantRouter from "./routes/assistant.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "FOSSLib API", timestamp: new Date().toISOString() });
});
app.use("/api/categories", categoriesRouter);
app.use("/api/apps", appsRouter);
app.use("/api/alternatives", alternativesRouter);
app.use("/api/submissions", submissionsRouter);
app.use("/api/assistant", assistantRouter);
// Serve frontend build if present (for single-service hosting on Render, Railway, Fly.io)
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api") || req.path === "/health") {
            return next();
        }
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}
app.listen(port, () => {
    console.log(`FOSSLib backend running on http://localhost:${port}`);
});
