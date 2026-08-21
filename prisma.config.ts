import "dotenv/config";
import { defineConfig } from "prisma/config";

function getDatabaseUrl(): string {
  const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  if (tursoUrl) {
    // If authToken is present and not already part of the query string, append it for CLI operations
    if (authToken && !tursoUrl.includes("authToken=")) {
      // Prisma CLI libSQL driver accepts https:// or libsql:// with ?authToken=
      let formattedUrl = tursoUrl;
      if (formattedUrl.startsWith("libsql://")) {
        formattedUrl = formattedUrl.replace("libsql://", "https://");
      }
      const sep = formattedUrl.includes("?") ? "&" : "?";
      return `${formattedUrl}${sep}authToken=${authToken}`;
    }
    return tursoUrl;
  }

  return "file:./dev.db";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
