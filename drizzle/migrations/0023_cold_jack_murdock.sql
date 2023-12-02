DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('published', 'archived', 'draft');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
