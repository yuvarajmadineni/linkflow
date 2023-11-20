ALTER TABLE "users" ALTER COLUMN "role" TYPE text[] USING role::text[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;