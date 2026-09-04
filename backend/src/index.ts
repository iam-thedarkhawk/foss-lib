import express from "express";
import cors from "cors";
import categoriesRouter from "./routes/categories.js";
import appsRouter from "./routes/apps.js";
import alternativesRouter from "./routes/alternatives.js";
import submissionsRouter from "./routes/submissions.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/categories", categoriesRouter);
app.use("/api/apps", appsRouter);
app.use("/api/alternatives", alternativesRouter);
app.use("/api/submissions", submissionsRouter);

app.listen(port, () => {
  console.log(`FOSSLib backend running on http://localhost:${port}`);
});
