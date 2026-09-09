import { Router } from "express";
import { prisma } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
// GET /api/submissions/verify - verify curator passkey
router.get("/verify", requireAdmin, (_req, res) => {
    res.json({ ok: true, message: "Curator passkey verified." });
});
// GET /api/submissions?status=PENDING - requires curator auth
router.get("/", requireAdmin, async (req, res) => {
    const { status } = req.query;
    try {
        const submissions = await prisma.submission.findMany({
            where: status ? { status: String(status) } : undefined,
            orderBy: { createdAt: "desc" },
        });
        res.json(submissions);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch submissions" });
    }
});
// POST /api/submissions - visitor submits a new alternative for review (PUBLIC)
router.post("/", async (req, res) => {
    const { proprietaryName, alternativeName, alternativeRepoUrl, categoryGuess, description, submitterEmail, } = req.body ?? {};
    if (!proprietaryName || !alternativeName || !alternativeRepoUrl || !description) {
        return res.status(400).json({
            error: "proprietaryName, alternativeName, alternativeRepoUrl and description are required",
        });
    }
    try {
        const submission = await prisma.submission.create({
            data: {
                proprietaryName: String(proprietaryName).trim(),
                alternativeName: String(alternativeName).trim(),
                alternativeRepoUrl: String(alternativeRepoUrl).trim(),
                categoryGuess: categoryGuess ? String(categoryGuess).trim() : null,
                description: String(description).trim(),
                submitterEmail: submitterEmail ? String(submitterEmail).trim() : null,
            },
        });
        res.status(201).json(submission);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create submission" });
    }
});
// PATCH /api/submissions/:id - approve or reject a submission (REQUIRES CURATOR AUTH)
router.patch("/:id", requireAdmin, async (req, res) => {
    const { status } = req.body ?? {};
    if (!["APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({ error: "status must be APPROVED or REJECTED" });
    }
    try {
        const submission = await prisma.submission.update({
            where: { id: req.params.id },
            data: { status },
        });
        // If APPROVED, promote into the catalogue!
        if (status === "APPROVED") {
            const categoryName = submission.categoryGuess || "General Productivity";
            const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            const category = await prisma.category.upsert({
                where: { slug: categorySlug },
                update: {},
                create: {
                    name: categoryName,
                    slug: categorySlug,
                },
            });
            let proprietaryApp = await prisma.proprietaryApp.findFirst({
                where: { name: submission.proprietaryName, categoryId: category.id },
            });
            if (!proprietaryApp) {
                proprietaryApp = await prisma.proprietaryApp.create({
                    data: {
                        name: submission.proprietaryName,
                        description: `Proprietary app (${submission.proprietaryName})`,
                        categoryId: category.id,
                    },
                });
            }
            let alternative = await prisma.fossAlternative.findFirst({
                where: { name: submission.alternativeName },
            });
            if (!alternative) {
                alternative = await prisma.fossAlternative.create({
                    data: {
                        name: submission.alternativeName,
                        description: submission.description,
                        license: "MIT",
                        platforms: "LINUX,WINDOWS,MACOS,WEB",
                        repoUrl: submission.alternativeRepoUrl,
                        stars: 100,
                    },
                });
            }
            await prisma.appAlternative.upsert({
                where: {
                    appId_alternativeId: {
                        appId: proprietaryApp.id,
                        alternativeId: alternative.id,
                    },
                },
                update: { fitNotes: submission.description },
                create: {
                    appId: proprietaryApp.id,
                    alternativeId: alternative.id,
                    fitNotes: submission.description,
                },
            });
        }
        res.json(submission);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update submission" });
    }
});
export default router;
