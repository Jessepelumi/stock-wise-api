import { neon, neonConfig } from "@neondatabase/serverless";
import { getDatabaseUrl } from "../lib/secrets.js";

export async function getDbClient() {
  try {
    const dburl = await getDatabaseUrl();

    neonConfig.fetchConnectionCache = true;
    const sql = neon(dburl);
    return sql;
  } catch (error) {
    console.error("Error fetching parameter:", error);
    throw new Error("Failed to retrieve database URL");
  }
}
