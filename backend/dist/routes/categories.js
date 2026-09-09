import { Router } from "express";
import { prisma } from "../db.js";
const router = Router();
// GET /api/categories - list all categories
router.get("/", async (_req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { apps: true },
                },
            },
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch categories" });
    }
});
// POST /api/categories - create a category
router.post("/", async (req, res) => {
    const { name, slug, icon, description } = req.body ?? {};
    if (!name || !slug) {
        return res.status(400).json({ error: "name and slug are required" });
    }
    try {
        const category = await prisma.category.create({
            data: { name, slug, icon, description },
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create category" });
    }
});
export default router;
