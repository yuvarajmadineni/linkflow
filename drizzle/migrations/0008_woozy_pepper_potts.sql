ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT '{"mobileuser"}';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;