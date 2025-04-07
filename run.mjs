import { execSync } from "child_process";
import { readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const args = process.argv.slice(2);
const isResiliant = args.includes("--no-crash");
const isTest = args.includes("--test");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, isTest ? "tests" : "src");
const scriptName = "interpret";

let passed = 0;
let failed = 0;

for (const file of readdirSync(dir)) {
  const filePath = path.join(dir, file);
  if (statSync(filePath).isFile()) {
    try {
      execSync(`npm run ${scriptName} -- "${filePath}"`, { stdio: "inherit" });
      passed++;
    } catch (err) {
      failed++;
      console.error(`Script failed for: ${file}`);
      if (!isResiliant) {
        console.log("Test Files Passed: ", passed);
        process.exit(1);
      }
    }
  }
}

if (isTest) {
  console.log("\n============ TEST RESULTS =============");
  console.log("Total Files Tested: ", passed + failed);
  console.log("Files Passed: ", passed);
  console.log("Files Failed: ", failed);
  console.log("=======================================\n");
}
