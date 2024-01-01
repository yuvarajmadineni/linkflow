ALTER TABLE "condition" DROP CONSTRAINT "condition_branch_node_id_branchnode_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "condition" ADD CONSTRAINT "condition_branch_node_id_branchnode_id_fk" FOREIGN KEY ("branch_node_id") REFERENCES "branchnode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
