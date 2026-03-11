import "dotenv/config";
import { defineConfig } from "prisma/config";

const database = process.env.DATABASE;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: database === "postgres"
      ? process.env.POSTGRES_URL
      : process.env.MYSQL_URL,
  },
});