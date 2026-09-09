import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "schema.prisma");

const target = process.argv[2];
if (!["sqlite", "postgresql"].includes(target)) {
  console.error("Usage: node switch-db.mjs <sqlite|postgresql>");
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, "utf-8");
content = content.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${target}"`
);
fs.writeFileSync(schemaPath, content, "utf-8");
console.log(`Prisma schema provider set to: ${target}`);
execSync("npx prisma generate", { stdio: "inherit", cwd: path.join(__dirname, "..") });
