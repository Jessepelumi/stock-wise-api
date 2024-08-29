import { text, pgTable, serial } from "drizzle-orm/pg-core";

export const LeadTable = pgTable("leads", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").notNull(),
  username: text("username").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
});
