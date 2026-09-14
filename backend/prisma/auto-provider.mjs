import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env if present
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const schemaPath = path.join(__dirname, "schema.prisma");
const dbUrl = (process.env.DATABASE_URL || "").trim();

let target = "sqlite";
if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
  target = "postgresql";
}

if (fs.existsSync(schemaPath)) {
  let content = fs.readFileSync(schemaPath, "utf-8");
  const updated = content.replace(
    /provider\s*=\s*"(sqlite|postgresql)"/,
    `provider = "${target}"`
  );
  if (content !== updated) {
    fs.writeFileSync(schemaPath, updated, "utf-8");
    console.log(`[auto-provider] Prisma schema provider set to "${target}"`);
  }
}
