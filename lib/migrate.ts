import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db";

const migrateDB = async () => {
  await migrate(db, { migrationsFolder: "drizzle/migrations" });
  process.exit();
};

migrateDB();
