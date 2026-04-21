// start_dev.js — spawns next dev and logs output to dev_out.txt
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "dev_out.txt");
const logStream = fs.createWriteStream(logPath, { flags: "w" });

const child = spawn("node", ["node_modules/next/dist/bin/next", "dev"], {
  cwd: __dirname,
  env: process.env,
  stdio: ["pipe", "pipe", "pipe"],
});

child.stdout.on("data", (d) => {
  logStream.write(d);
  process.stdout.write(d);
});
child.stderr.on("data", (d) => {
  logStream.write(d);
  process.stderr.write(d);
});
child.on("exit", (code) => {
  logStream.write(`\n[exit code: ${code}]\n`);
  logStream.end();
});
