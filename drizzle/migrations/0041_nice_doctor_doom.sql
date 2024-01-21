ALTER TABLE "task" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;