import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "../../prisma/seed";

function parseSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inDollarQuote = false;

  for (let i = 0; i < sql.length; i++) {
    if (sql[i] === "$" && sql[i + 1] === "$") {
      inDollarQuote = !inDollarQuote;
      current += "$$";
      i++;
      continue;
    }
    if (!inDollarQuote && sql[i] === ";") {
      const trimmed = current.replace(/^--[^\n]*\n?/gm, "").trim();
      if (trimmed.length > 0) statements.push(trimmed);
      current = "";
      continue;
    }
    current += sql[i];
  }

  const trimmed = current.replace(/^--[^\n]*\n?/gm, "").trim();
  if (trimmed.length > 0) statements.push(trimmed);
  return statements;
}

async function runSqlFile(relativePath: string): Promise<void> {
  const sqlPath = path.join(process.cwd(), relativePath);
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
  await runSqlFile("prisma/init.sql");
}

export async function applyCmsSchemaSql(): Promise<void> {
  await runSqlFile("prisma/cms-migration.sql");
}

export async function setupProductionDatabase(): Promise<{ alreadySeeded: boolean }> {
  await applyCmsSchemaSql();

  if (await isDatabaseSeeded()) {
    return { alreadySeeded: true };
  }

  await applySchemaSql();
  await seedDatabase();
  return { alreadySeeded: false };
}
