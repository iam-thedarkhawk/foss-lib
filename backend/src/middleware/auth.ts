import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return res.status(500).json({ error: "Server configuration error: ADMIN_TOKEN is not set." });
  }

  const authHeader = req.headers.authorization;
  const customHeader = req.headers["x-admin-token"];

  let providedToken: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    providedToken = authHeader.substring(7).trim();
  } else if (typeof customHeader === "string") {
    providedToken = customHeader.trim();
  }

  if (!providedToken || providedToken !== adminToken) {
    return res.status(401).json({
      error: "Unauthorized: A valid curator passkey is required to perform moderation actions.",
    });
  }

  next();
}
