CREATE TABLE IF NOT EXISTS "organization" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text,
	"name" text,
	CONSTRAINT "organization_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text,
	"full_name" text,
	"email" text,
	"image_url" text,
	"role" text,
	"organization_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
