ALTER TABLE "user_to_groups" DROP CONSTRAINT "user_to_groups_group_id_groups_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_groups" ADD CONSTRAINT "user_to_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
