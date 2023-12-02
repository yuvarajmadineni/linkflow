CREATE TABLE IF NOT EXISTS "workflows" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"instructions" text NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workflows" ADD CONSTRAINT "workflows_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
