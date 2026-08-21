import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __prismaInstance?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  if (!url && process.env.NODE_ENV === "production") {
    console.warn(
      "[PrismaLibSql] TURSO_DATABASE_URL is not set in production. Falling back to local file:./dev.db. " +
      "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel settings for cloud database persistence."
    );
  }

  const databaseUrl = url || "file:./dev.db";

  const adapter = new PrismaLibSql({
    url: databaseUrl,
    authToken: authToken || undefined,
  });

  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.__prismaInstance) {
    globalForPrisma.__prismaInstance = createPrismaClient();
  }
  return globalForPrisma.__prismaInstance;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    // Ignore bundler/runtime property probing during module resolution & page-data collection
    if (
      typeof prop === "symbol" ||
      prop === "then" ||
      prop === "toJSON" ||
      prop === "$$typeof" ||
      prop === "__esModule"
    ) {
      return undefined;
    }
    const client = getPrisma();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
