import { Router } from "express";
import { prisma } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
// GET /api/apps?category=slug&search=word&platform=LINUX (PUBLIC)
router.get("/", async (req, res) => {
    const { category, search, platform } = req.query;
    try {
        const apps = await prisma.proprietaryApp.findMany({
            where: {
                ...(category
                    ? { category: { slug: String(category) } }
                    : {}),
                ...(search
                    ? {
                        OR: [
                            { name: { contains: String(search) } },
                            { description: { contains: String(search) } },
                        ],
                    }
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
        const formatted = apps.map((app) => ({
            ...app,
            alternatives: app.alternatives
                .map((link) => ({
                ...link,
                alternative: {
                    ...link.alternative,
                    platforms: link.alternative.platforms
                        ? link.alternative.platforms.split(",").map((p) => p.trim())
                        : [],
                },
            }))
                .filter((link) => {
                if (!platform)
                    return true;
                return link.alternative.platforms.includes(String(platform).toUpperCase());
            }),
        }));
        res.json(formatted);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch apps" });
    }
});
// GET /api/apps/:id (PUBLIC)
router.get("/:id", async (req, res) => {
    try {
        const app = await prisma.proprietaryApp.findUnique({
            where: { id: req.params.id },
            include: {
                category: true,
                alternatives: { include: { alternative: true } },
            },
        });
        if (!app)
            return res.status(404).json({ error: "not found" });
        const formatted = {
            ...app,
            alternatives: app.alternatives.map((link) => ({
                ...link,
                alternative: {
                    ...link.alternative,
                    platforms: link.alternative.platforms
                        ? link.alternative.platforms.split(",").map((p) => p.trim())
                        : [],
                },
            })),
        };
        res.json(formatted);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch app" });
    }
});
// POST /api/apps - create a proprietary app entry (ADMIN ONLY)
router.post("/", requireAdmin, async (req, res) => {
    const { name, description, website, categoryId } = req.body ?? {};
    if (!name || !description || !categoryId) {
        return res
            .status(400)
            .json({ error: "name, description and categoryId are required" });
    }
    try {
        const app = await prisma.proprietaryApp.create({
            data: { name, description, website, categoryId },
            include: { category: true },
        });
        res.status(201).json(app);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create app" });
    }
});
export default router;
