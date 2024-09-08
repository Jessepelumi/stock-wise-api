import { z } from "zod";

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
    hasError = true;
    message = "Invalid email. Try again.";
  }

  return {
    data: validData,
    hasError: hasError,
    message: message,
  };
}
