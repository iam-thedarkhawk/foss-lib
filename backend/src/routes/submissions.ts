import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/submissions?status=PENDING
router.get("/", async (req, res) => {
  const { status } = req.query;
  const submissions = await prisma.submission.findMany({
    where: status ? { status: String(status) as any } : undefined,
    orderBy: { createdAt: "desc" },
  });
  res.json(submissions);
});

// POST /api/submissions - visitor submits a new alternative for review
router.post("/", async (req, res) => {
  const {
    proprietaryName,
    alternativeName,
    alternativeRepoUrl,
    categoryGuess,
    description,
    submitterEmail,
  } = req.body ?? {};

  if (!proprietaryName || !alternativeName || !alternativeRepoUrl || !description) {
    return res.status(400).json({
      error:
        "proprietaryName, alternativeName, alternativeRepoUrl and description are required",
    });
  }

  const submission = await prisma.submission.create({
    data: {
      proprietaryName,
      alternativeName,
      alternativeRepoUrl,
      categoryGuess,
      description,
      submitterEmail,
    },
  });

  res.status(201).json(submission);
});

// PATCH /api/submissions/:id - approve or reject a submission
router.patch("/:id", async (req, res) => {
  const { status } = req.body ?? {};
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ error: "status must be APPROVED or REJECTED" });
  }
  const submission = await prisma.submission.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(submission);
});

export default router;
