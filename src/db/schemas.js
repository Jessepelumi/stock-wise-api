import { text, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const LeadTable = pgTable("leads", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").notNull(),
  bio: text("bio").default("hanoled user"),
  createdAt: timestamp("created_at").defaultNow(),
});
