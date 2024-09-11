import { configDotenv } from "dotenv";
import * as secrets from "../lib/secrets.js";

configDotenv();

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log("Usage: tsx src/cli/putDbSecrets.js <stage> <dbUrl>");
  process.exit(1);
}

const [stage, dbUrl] = args;
const validStages = ["dev", "prod"];

if (!validStages.includes(stage)) {
  console.log("Invalid stage. Valid stages include, 'dev' & 'prod'");
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`Setting secrets for stage: ${stage}...`);

  secrets
    .putDatabaseUrl(stage, dbUrl)
    .then((val) => {
      console.log(val);
      console.log(`Secret set successfully: ${val}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Failed to set secret: ${error.message}`);
      process.exit(1);
    });
}
