CREATE TABLE IF NOT EXISTS "branchnode" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"workflow_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "condition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"branch_node_id" uuid NOT NULL,
	"lhs" text NOT NULL,
	"rhs" text NOT NULL,
	"operator" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branchnode" ADD CONSTRAINT "branchnode_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "condition" ADD CONSTRAINT "condition_branch_node_id_branchnode_id_fk" FOREIGN KEY ("branch_node_id") REFERENCES "branchnode"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
