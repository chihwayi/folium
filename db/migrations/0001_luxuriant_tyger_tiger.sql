ALTER TABLE "books" ADD COLUMN "sample_excerpt" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "curated_position" integer DEFAULT 0 NOT NULL;