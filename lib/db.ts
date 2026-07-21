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
        CREATE TABLE IF NOT EXISTS talk_variants (
          id          uuid PRIMARY KEY,
          deck        text NOT NULL,
          name        text NOT NULL,
          edits       jsonb NOT NULL,
          created_at  timestamptz NOT NULL DEFAULT now(),
          updated_at  timestamptz NOT NULL DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS talk_variants_deck_idx
          ON talk_variants (deck, updated_at DESC);
      `);
    })().catch((e) => {
      // Don't cache a transient cold-start failure forever — let it retry.
      _schema = null;
      throw e;
    });
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

/* ───────────────────── Talk variants (in-deck text edits) ─────────────────────
   Named snapshots of text overrides for a standalone deck (e.g. /talk/sf2026).
   `edits` is an array of { eid, html } — only the changed text nodes, applied
   client-side on top of the current deck markup. */

export type TalkEdit = { eid: string; html: string; orig?: string };
export type TalkVariant = {
  id: string;
  deck: string;
  name: string;
  edits: TalkEdit[];
  created_at: string;
  updated_at: string;
};

export async function listTalkVariants(deck: string): Promise<TalkVariant[]> {
  return withDb(async (p) => {
    const { rows } = await p.query(
      `SELECT id, deck, name, edits, created_at, updated_at
         FROM talk_variants WHERE deck = $1 ORDER BY updated_at DESC LIMIT 200`,
      [deck],
    );
    return rows as TalkVariant[];
  }, []);
}

export async function saveTalkVariant(v: {
  id?: string;
  deck: string;
  name: string;
  edits: TalkEdit[];
}): Promise<string | null> {
  return withDb(async (p) => {
    const id = v.id || randomUUID();
    await p.query(
      `INSERT INTO talk_variants (id, deck, name, edits)
         VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, edits = EXCLUDED.edits, updated_at = now()
       WHERE talk_variants.deck = EXCLUDED.deck`,
      [id, v.deck, v.name, JSON.stringify(v.edits)],
    );
    return id;
  }, null);
}

export async function countTalkVariants(deck: string): Promise<number> {
  return withDb(async (p) => {
    const { rows } = await p.query(
      `SELECT count(*)::int AS n FROM talk_variants WHERE deck = $1`,
      [deck],
    );
    return rows[0]?.n ?? 0;
  }, 0);
}

export async function deleteTalkVariant(id: string, deck: string): Promise<boolean> {
  return withDb(async (p) => {
    await p.query(`DELETE FROM talk_variants WHERE id = $1 AND deck = $2`, [id, deck]);
    return true;
  }, false);
}
