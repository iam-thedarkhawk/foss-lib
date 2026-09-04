import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/apps?category=slug&search=word
// Returns proprietary apps with their linked FOSS alternatives.
router.get("/", async (req, res) => {
  const { category, search } = req.query;

  const apps = await prisma.proprietaryApp.findMany({
    where: {
      ...(category
        ? { category: { slug: String(category) } }
        : {}),
      ...(search
        ? { name: { contains: String(search), mode: "insensitive" } }
        : {}),
    },
    include: {
      category: true,
      alternatives: {
        include: { alternative: true },
      },
    },
    orderBy: { name: "asc" },
  });

  res.json(apps);
});

// GET /api/apps/:id
router.get("/:id", async (req, res) => {
  const app = await prisma.proprietaryApp.findUnique({
    where: { id: req.params.id },
    include: {
      category: true,
      alternatives: { include: { alternative: true } },
    },
  });
  if (!app) return res.status(404).json({ error: "not found" });
  res.json(app);
});

// POST /api/apps - create a proprietary app entry
router.post("/", async (req, res) => {
  const { name, description, website, categoryId } = req.body ?? {};
  if (!name || !description || !categoryId) {
    return res
      .status(400)
      .json({ error: "name, description and categoryId are required" });
  }
  const app = await prisma.proprietaryApp.create({
    data: { name, description, website, categoryId },
  });
  res.status(201).json(app);
});

export default router;
