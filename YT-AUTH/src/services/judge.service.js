// src/services/judge.service.js
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { languageConfig } from "../utils/languageConfig.js";

function execPromise(cmd, timeoutMs) {
  return new Promise((resolve) => {
    exec(cmd, { timeout: timeoutMs }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}

export async function runCode({ language, code, input, timeLimit = 2000 }) {
  const config = languageConfig[language];
  if (!config) throw new Error("Unsupported language");

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "judge-"));
  const filePath = path.join(tempDir, config.fileName);
  const inputPath = path.join(tempDir, "input.txt");

  await fs.writeFile(filePath, code);
  await fs.writeFile(inputPath, input || "");

  const containerName = `judge-${Date.now()}`;
  const mountFlag = `-v "${tempDir}:/box"`;

  try {
    if (config.compileCmd) {
      const compileCmd = `docker run --rm --name ${containerName}-compile ${mountFlag} ${config.image} ${config.compileCmd("/box/" + config.fileName)}`;
      const compileResult = await execPromise(compileCmd, 10000);

      if (compileResult.error || compileResult.stderr) {
        return { status: "Compilation Error", output: compileResult.stderr };
      }
    }

    const runCmd = `docker run --rm --name ${containerName} ${mountFlag} ` +
      `--memory=256m --cpus=0.5 --network=none ` +
      `${config.image} sh -c "cat /box/input.txt | timeout ${timeLimit / 1000} ${config.runCmd("/box/" + config.fileName)}"`;

    const runResult = await execPromise(runCmd, timeLimit + 2000);

    if (runResult.error?.killed) {
      return { status: "Time Limit Exceeded", output: "" };
    }
    if (runResult.error) {
      return { status: "Runtime Error", output: runResult.stderr };
    }

    return { status: "Success", output: runResult.stdout.trim() };

  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}