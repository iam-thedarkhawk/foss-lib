import { Router } from "express";
import { prisma } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/alternatives?category=slug&search=word&platform=LINUX (PUBLIC)
router.get("/", async (req, res) => {
  const { category, search, platform } = req.query;

  try {
    const alternatives = await prisma.fossAlternative.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { name: { contains: String(search) } },
                { description: { contains: String(search) } },
              ],
            }
          : {}),
        ...(category
          ? {
              apps: {
                some: {
                  app: {
                    category: { slug: String(category) },
                  },
                },
              },
            }
          : {}),
      },
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

    const formatted = alternatives
      .map((alt) => ({
        ...alt,
        platforms: alt.platforms
          ? alt.platforms.split(",").map((p) => p.trim())
          : [],
      }))
      .filter((alt) => {
        if (!platform) return true;
        return alt.platforms.includes(String(platform).toUpperCase());
      });

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch alternatives" });
  }
});

// GET /api/alternatives/:id (PUBLIC)
router.get("/:id", async (req, res) => {
  try {
    const alternative = await prisma.fossAlternative.findUnique({
      where: { id: req.params.id },
      include: {
        apps: {
          include: {
            app: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!alternative) return res.status(404).json({ error: "not found" });

    const formatted = {
      ...alternative,
      platforms: alternative.platforms
        ? alternative.platforms.split(",").map((p) => p.trim())
        : [],
    };

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch alternative" });
  }
});

// POST /api/alternatives (ADMIN ONLY)
router.post("/", requireAdmin, async (req, res) => {
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

  try {
    const platString = Array.isArray(platforms)
      ? platforms.join(",")
      : platforms || "";

    const alternative = await prisma.fossAlternative.create({
      data: {
        name,
        description,
        license,
        platforms: platString,
        repoUrl,
        website,
        stars: 0,
        apps: {
          create: { appId, fitNotes },
        },
      },
      include: {
        apps: {
          include: { app: { include: { category: true } } },
        },
      },
    });

    res.status(201).json({
      ...alternative,
      platforms: alternative.platforms
        ? alternative.platforms.split(",").map((p) => p.trim())
        : [],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create alternative" });
  }
});

export default router;
