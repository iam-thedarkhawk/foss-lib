import { Router } from "express";
import { prisma } from "../db.js";
const router = Router();
// GET /api/alternatives - list all FOSS alternatives
router.get("/", async (_req, res) => {
    const alternatives = await prisma.fossAlternative.findMany({
        orderBy: { name: "asc" },
    });
    res.json(alternatives);
});
// POST /api/alternatives - create a FOSS alternative and link it to an app
router.post("/", async (req, res) => {
    const { name, description, license, platforms, repoUrl, website, appId, fitNotes, } = req.body ?? {};
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
