// Local verification only. Never connects to Cloudflare or the production database.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
export const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
export function createLocalDB() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(schema);
  return { sqlite, prepare(sql) {
    const statement = sqlite.prepare(sql);
    let args = [];
    return { bind(...values) { args = values; return this; },
      async first() { return statement.get(...args) ?? null; },
      async all() { return {results: statement.all(...args)}; }
    };
  }};
}
