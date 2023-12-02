ALTER TABLE "workflows" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;