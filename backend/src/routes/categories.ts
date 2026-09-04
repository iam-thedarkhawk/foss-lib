import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/categories - list all categories
router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  res.json(categories);
});

// POST /api/categories - create a category
router.post("/", async (req, res) => {
  const { name, slug } = req.body ?? {};
  if (!name || !slug) {
    return res.status(400).json({ error: "name and slug are required" });
  }
  const category = await prisma.category.create({ data: { name, slug } });
  res.status(201).json(category);
});

export default router;
