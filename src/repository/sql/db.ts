import Database from 'better-sqlite3';

const db = new Database('gemstone.sqlite', { fileMustExist: false });
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS user_links (
  discord_user_id  TEXT PRIMARY KEY,
  vrc_user_id TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  val TEXT NOT NULL
);
`);

export default db;
