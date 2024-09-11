CREATE TABLE IF NOT EXISTS "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"bio" text DEFAULT 'hanoled user',
	"created_at" timestamp DEFAULT now()
);
