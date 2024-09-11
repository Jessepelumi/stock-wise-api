import { desc, eq } from "drizzle-orm";
import { getDrizzleDbClient } from "./client.js";
import * as schemas from "./schemas.js";

export async function newLead({ email }) {
  try {
    const db = await getDrizzleDbClient();
    const result = await db
      .insert(schemas.LeadTable)
      .values({ email: email })
      .returning();

    if (result.length === 1) {
      return result[0];
    }
    return result;
  } catch (error) {
    console.error("Error in newLead function:", error);
    throw new Error("Failed to insert lead");
  }
}

export async function listLeads() {
  try {
    const db = await getDrizzleDbClient();
    const result = await db.select().from(schemas.LeadTable);

    return result;
  } catch (error) {
    console.error("Error in listLeads function:", error);
    throw new Error("Failed to fetch data from table");
  }
}

export async function getLead(id) {
  try {
    const db = await getDrizzleDbClient();
    const result = await db
      .select()
      .from(schemas.LeadTable)
      .where(eq(schemas.LeadTable.id, id));

    if (result.length === 1) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error("Error with getLead function:", error);
    throw new Error("Unable to fetch result with specified id");
  }
}

export async function deleteLead(id) {
  try {
    const db = await getDrizzleDbClient();
    const result = await db
      .delete(schemas.LeadTable)
      .where(eq(schemas.LeadTable.id, id))
      .returning();

    if (result.length === 1) {
      return result[0];
    }
    return null;
  } catch (error) {}
}
