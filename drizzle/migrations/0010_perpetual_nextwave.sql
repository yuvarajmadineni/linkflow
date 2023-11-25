CREATE TABLE IF NOT EXISTS "user_to_groups" (
	"user_id" uuid NOT NULL,
	"group_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "group_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_groups" ADD CONSTRAINT "user_to_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_groups" ADD CONSTRAINT "user_to_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
