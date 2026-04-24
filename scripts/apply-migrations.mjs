#!/usr/bin/env node
// =============================================================================
// apply-migrations.mjs
// =============================================================================
// Prefers the Supabase CLI (`npx supabase db push`) and falls back to a
// concatenated ./supabase/_apply.sql you can paste into Supabase Studio.
//
// Usage:
//   node scripts/apply-migrations.mjs            # auto: CLI first, else paste file
//   node scripts/apply-migrations.mjs --local    # push to local dev db (supabase start)
//   node scripts/apply-migrations.mjs --linked   # push to linked remote project
//   node scripts/apply-migrations.mjs --paste    # only generate _apply.sql
//
// How it picks a path:
//   1. If SUPABASE_DB_URL or DATABASE_URL is in env → supabase db push --db-url
//   2. If `.temp/project-ref` (written by `supabase link`) exists → supabase db push --linked
//   3. If a local stack is up (`supabase status` ok) → supabase db push --local
//   4. Otherwise → write ./supabase/_apply.sql and print paste instructions
//
// Safe to rerun. Every migration uses idempotent DDL + on conflict do nothing.
// =============================================================================

import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const migrationsDir = path.join(repoRoot, "supabase", "migrations");
const outFile = path.join(repoRoot, "supabase", "_apply.sql");
const linkedRefFile = path.join(repoRoot, "supabase", ".temp", "project-ref");

async function loadEnvLocal() {
  const envPath = path.join(repoRoot, ".env.local");
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    /* noop */
  }
}

async function readMigrations() {
  const entries = await fs.readdir(migrationsDir);
  const files = entries.filter((name) => name.endsWith(".sql") && !name.startsWith("_")).sort();
  return Promise.all(
    files.map(async (name) => {
      const full = path.join(migrationsDir, name);
      const sql = await fs.readFile(full, "utf8");
      return { name, sql };
    }),
  );
}

async function writeConcatenated(migrations) {
  const banner = [
    "-- =============================================================================",
    "-- Summer: concatenated migrations for Supabase Studio paste",
    `-- Generated: ${new Date().toISOString()}`,
    "-- Paste the full file into Supabase → SQL Editor → New query → Run.",
    "-- Safe to rerun — every insert uses on conflict do nothing / idempotent DDL.",
    "-- =============================================================================",
    "",
  ].join("\n");
  const sections = migrations
    .map((m) => `-- ${"-".repeat(75)}\n-- FILE: ${m.name}\n-- ${"-".repeat(75)}\n\n${m.sql}\n`)
    .join("\n");
  await fs.writeFile(outFile, banner + sections, "utf8");
}

function cliExists() {
  const res = spawnSync("npx", ["--no-install", "supabase", "--version"], { encoding: "utf8" });
  return res.status === 0;
}

async function linkedProjectRef() {
  try {
    const raw = (await fs.readFile(linkedRefFile, "utf8")).trim();
    return raw || null;
  } catch {
    return null;
  }
}

function runCli(args) {
  console.log(`> npx supabase ${args.join(" ")}`);
  const res = spawnSync("npx", ["--no-install", "supabase", ...args], {
    stdio: "inherit",
    cwd: repoRoot,
    env: process.env,
  });
  return res.status === 0;
}

async function pushViaCli({ local, dbUrl }) {
  if (dbUrl) {
    return runCli(["db", "push", "--include-all", "--yes", "--db-url", dbUrl]);
  }
  if (local) {
    return runCli(["db", "push", "--include-all", "--yes", "--local"]);
  }
  return runCli(["db", "push", "--include-all", "--yes", "--linked"]);
}

async function main() {
  const args = new Set(process.argv.slice(2));
  await loadEnvLocal();
  const migrations = await readMigrations();
  console.log(`found ${migrations.length} migration file(s):`);
  for (const m of migrations) console.log("  ·", m.name);

  const wantPaste = args.has("--paste");
  const wantLocal = args.has("--local");
  const wantLinked = args.has("--linked");

  if (wantPaste) {
    await writeConcatenated(migrations);
    console.log(`\nwrote ${path.relative(repoRoot, outFile)}`);
    console.log("Paste it into Supabase → SQL Editor → Run.");
    return;
  }

  if (!cliExists()) {
    console.log("\nsupabase CLI not found; falling back to paste mode.");
    await writeConcatenated(migrations);
    console.log(`wrote ${path.relative(repoRoot, outFile)} — paste into Supabase Studio.`);
    return;
  }

  // 1) explicit db url wins
  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || null;
  if (dbUrl) {
    console.log("\nusing SUPABASE_DB_URL / DATABASE_URL");
    const ok = await pushViaCli({ dbUrl });
    if (ok) return;
  }

  // 2) explicit flags
  if (wantLocal) {
    const ok = await pushViaCli({ local: true });
    if (ok) return;
  }
  if (wantLinked) {
    const ok = await pushViaCli({});
    if (ok) return;
  }

  // 3) auto-detect linked project
  const ref = await linkedProjectRef();
  if (ref) {
    console.log(`\ndetected linked project ref: ${ref}`);
    const ok = await pushViaCli({});
    if (ok) return;
  }

  // 4) try local
  console.log("\nno SUPABASE_DB_URL set and no linked project — trying local dev db.");
  const ok = await pushViaCli({ local: true });
  if (ok) return;

  // 5) final fallback
  console.log("\nCLI push failed on every strategy — generating paste-mode SQL.");
  await writeConcatenated(migrations);
  console.log(`wrote ${path.relative(repoRoot, outFile)} — paste into Supabase Studio.`);
  console.log("Or run: npx supabase link --project-ref <your-ref> && npm run migrate");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
