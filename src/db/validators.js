import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDrizzleDbClient } from "./client.js";
import * as schemas from "./schemas.js";

export async function validateLeads(postData) {
  const lead = z.object({
    email: z.string().email(),
  });

  let validData = {};
  let hasError;
  let message;

  try {
    validData = lead.parse(postData);
    hasError = false;
    message = "";
  } catch (error) {
    return {
      data: validData,
      hasError: true,
      message: "Invalid email. Try again.",
    };
  }

  try {
    const db = await getDrizzleDbClient();
    const emailData = validData["email"];
    const existingData = await db
      .select()
      .from(schemas.LeadTable)
      .where(eq(schemas.LeadTable.email, emailData));

    if (existingData.length > 0) {
      return {
        data: validData,
        hasError: true,
        message: "Email has been registered. Please use a different email.",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      hasError: true,
      message: "An error occured. Please try again.",
    };
  }

  return {
    data: validData,
    hasError: false,
    message: "Email valid",
  };
}
