import { spawn } from "child_process";

console.log("\x1b[32m[FOSSLib]\x1b[0m Starting Backend API and Frontend Dev Server...\n");

const backend = spawn("npm", ["run", "dev", "--prefix", "backend"], {
  stdio: "inherit",
  shell: true,
});

const frontend = spawn("npm", ["run", "dev", "--prefix", "frontend"], {
  stdio: "inherit",
  shell: true,
});

process.on("SIGINT", () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
