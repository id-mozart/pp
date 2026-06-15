import { Pool } from "pg";
import { randomUUID } from "crypto";

/**
 * Lightweight Postgres layer for the /admin section (leads inbox + mini-CMS).
 * Degrades gracefully: with no DATABASE_URL the whole site still builds and
 * runs — reads return null/[], writes are no-ops. Provision a Railway Postgres
 * service (it injects DATABASE_URL automatically) to turn persistence on.
 */

let _pool: Pool | null = null;
let _schema: Promise<void> | null = null;

export function hasDb() {
  return !!process.env.DATABASE_URL;
}

function pool(): Pool | null {
  if (!hasDb()) return null;
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 4,
      ssl:
        process.env.PGSSL === "require"
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }
  return _pool;
}

async function ensureSchema(p: Pool) {
  if (!_schema) {
    _schema = (async () => {
      await p.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id          uuid PRIMARY KEY,
          type        text,
          name        text,
          contact     text,
          email       text,
          phone       text,
          topic       text,
          appt        text,
          message     text,
          created_at  timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS content (
          key         text PRIMARY KEY,
          data        jsonb NOT NULL,
          updated_at  timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS media (
          id          text PRIMARY KEY,
          mime        text NOT NULL,
          bytes       bytea NOT NULL,
          created_at  timestamptz NOT NULL DEFAULT now()
        );
      `);
    })();
  }
  return _schema;
}

async function withDb<T>(fn: (p: Pool) => Promise<T>, fallback: T): Promise<T> {
  const p = pool();
  if (!p) return fallback;
  try {
    await ensureSchema(p);
    return await fn(p);
  } catch (e) {
    console.error("[db] error", e);
    return fallback;
  }
}

/* ───────────────────────── Leads ───────────────────────── */

export type Lead = {
  id: string;
  type: string;
  name: string;
  contact: string | null;
  email: string | null;
  phone: string | null;
  topic: string | null;
  appt: string | null;
  message: string | null;
  created_at: string;
};

export async function insertLead(l: Omit<Lead, "id" | "created_at">) {
  return withDb(async (p) => {
    const id = randomUUID();
    await p.query(
      `INSERT INTO leads (id, type, name, contact, email, phone, topic, appt, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, l.type, l.name, l.contact, l.email, l.phone, l.topic, l.appt, l.message],
    );
    return id;
  }, null);
}

export async function listLeads(limit = 200): Promise<Lead[]> {
  return withDb(async (p) => {
    const { rows } = await p.query(
      `SELECT * FROM leads ORDER BY created_at DESC LIMIT $1`,
      [limit],
    );
    return rows as Lead[];
  }, []);
}

export async function countLeads(): Promise<number> {
  return withDb(async (p) => {
    const { rows } = await p.query(`SELECT count(*)::int AS n FROM leads`);
    return rows[0]?.n ?? 0;
  }, 0);
}

/* ───────────────────────── Content (CMS) ───────────────────────── */

export async function getContent<T = unknown>(key: string): Promise<T | null> {
  return withDb(async (p) => {
    const { rows } = await p.query(`SELECT data FROM content WHERE key = $1`, [key]);
    return (rows[0]?.data as T) ?? null;
  }, null);
}

export async function setContent(key: string, data: unknown) {
  return withDb(async (p) => {
    await p.query(
      `INSERT INTO content (key, data, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [key, JSON.stringify(data)],
    );
    return true;
  }, false);
}

/* ───────────────────────── Media (uploaded images) ───────────────────────── */

export async function insertMedia(bytes: Buffer, mime: string) {
  return withDb(async (p) => {
    const id = randomUUID().replace(/-/g, "");
    await p.query(`INSERT INTO media (id, mime, bytes) VALUES ($1,$2,$3)`, [
      id,
      mime,
      bytes,
    ]);
    return id;
  }, null);
}

export async function getMedia(
  id: string,
): Promise<{ mime: string; bytes: Buffer } | null> {
  return withDb(async (p) => {
    const { rows } = await p.query(`SELECT mime, bytes FROM media WHERE id = $1`, [id]);
    if (!rows[0]) return null;
    return { mime: rows[0].mime as string, bytes: rows[0].bytes as Buffer };
  }, null);
}
