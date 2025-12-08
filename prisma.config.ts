// File: prisma.config.ts
import "dotenv/config";  // <--- THIS IS CRITICAL
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
