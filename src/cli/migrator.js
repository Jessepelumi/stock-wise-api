import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../db/schemas.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { configDotenv } from "dotenv";
import { getDatabaseUrl } from "../lib/secrets.js";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

configDotenv();

async function performMigration() {
  const dburl = await getDatabaseUrl();
  if (!dburl) {
    console.log("Database URL not found");
    return;
  }

  try {
    neonConfig.webSocketConstructor = ws;

    const pool = new Pool({ connectionString: dburl });
    pool.on("error", (err) => console.error(err));

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const db = drizzle(client, { schema });
      await migrate(db, { migrationsFolder: "src/migrations" });

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    await pool.end();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Running migrations...");
  performMigration()
    .then((value) => {
      console.log("Migrations done");
      process.exit(0);
    })
    .catch((error) => {
      console.log("Migrations error");
      process.exit(1);
    });
}
