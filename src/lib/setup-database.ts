import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "../../prisma/seed";

function parseSqlStatements(sql: string): string[] {
  return sql
    .split(";")
    .map((s) => s.replace(/^--[^\n]*\n?/gm, "").trim())
    .filter((s) => s.length > 0);
}

function isIgnorableDbError(err: unknown): boolean {
  const msg = String(err);
  return (
    msg.includes("already exists") ||
    msg.includes("duplicate key") ||
    msg.includes("42P07") || // relation exists
    msg.includes("42710") // type exists
  );
}

export async function isDatabaseSeeded(): Promise<boolean> {
  try {
    const admin = await prisma.user.findUnique({ where: { email: "admin@demo.com" } });
    return Boolean(admin);
  } catch {
    return false;
  }
}

export async function applySchemaSql(): Promise<void> {
  const sqlPath = path.join(process.cwd(), "prisma", "init.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  const statements = parseSqlStatements(sql);

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (err) {
      if (!isIgnorableDbError(err)) throw err;
    }
  }
}

export async function setupProductionDatabase(): Promise<{ alreadySeeded: boolean }> {
  if (await isDatabaseSeeded()) {
    return { alreadySeeded: true };
  }

  await applySchemaSql();
  await seedDatabase();
  return { alreadySeeded: false };
}
