ALTER TABLE "condition" ALTER COLUMN "lhs" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "condition" ALTER COLUMN "rhs" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "condition" ALTER COLUMN "operator" DROP NOT NULL;