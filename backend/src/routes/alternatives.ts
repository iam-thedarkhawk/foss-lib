import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/alternatives?category=slug&search=word - list catalogue alternatives
router.get("/", async (req, res) => {
  const { category, search } = req.query;
  const alternatives = await prisma.fossAlternative.findMany({
    where: {
      ...(search
        ? { OR: [
            { name: { contains: String(search), mode: "insensitive" } },
            { description: { contains: String(search), mode: "insensitive" } },
          ] }
        : {}),
      ...(category
        ? { apps: { some: { app: { category: { slug: String(category) } } } } }
        : {}),
    },
    include: {
      apps: {
        include: { app: { include: { category: true } } },
      },
    },
    orderBy: { name: "asc" },
  });
  res.json(alternatives);
});

// GET /api/alternatives/:id - show an alternative and its catalogue links
router.get("/:id", async (req, res) => {
  const alternative = await prisma.fossAlternative.findUnique({
    where: { id: req.params.id },
    include: {
      apps: {
        include: { app: { include: { category: true } } },
      },
    },
  });

  if (!alternative) return res.status(404).json({ error: "not found" });
  res.json(alternative);
});

// POST /api/alternatives - create a FOSS alternative and link it to an app
router.post("/", async (req, res) => {
  const {
    name,
    description,
    license,
    platforms,
    repoUrl,
    website,
    appId,
    fitNotes,
  } = req.body ?? {};

  if (!name || !description || !license || !repoUrl || !appId) {
    return res.status(400).json({
      error: "name, description, license, repoUrl and appId are required",
    });
  }

  const alternative = await prisma.fossAlternative.create({
    data: {
      name,
      description,
      license,
      platforms: platforms ?? [],
      repoUrl,
      website,
      apps: {
        create: { appId, fitNotes },
      },
    },
    include: { apps: true },
  });

  res.status(201).json(alternative);
});

export default router;
