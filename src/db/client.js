import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getDatabaseUrl } from "../lib/secrets.js";

export async function getDbClient() {
  try {
    const dburl = await getDatabaseUrl();
    const sql = neon(dburl);
    
    return sql;
  } catch (error) {
    console.error("Error fetching parameter:", error);
    throw new Error("Failed to create Neon SQL client");
  }
}

export async function getDrizzleDbClient() {
  try {
    const client = await getDbClient();
    const drizzleClient = drizzle(client);

    return drizzleClient;
  } catch (error) {
    console.error("Error initalizing Drizzle ORM:", error);
    throw new Error("Failed to initialize Drizzle ORM");
  }
}
