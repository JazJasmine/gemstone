import db from './sql/db';

type DbRecord = { discord_user_id: string; vrc_user_id: string } | undefined;

const insertOrUpdate = db.prepare(`
INSERT INTO user_links (discord_user_id, vrc_user_id)
VALUES (@discord_user_id, @vrc_user_id)
ON CONFLICT(discord_user_id) DO UPDATE SET
  vrc_user_id = excluded.vrc_user_id
`);

const getByDiscordId = db.prepare(`
SELECT discord_user_id, vrc_user_id FROM user_links WHERE discord_user_id = ?
`);

const getByVrcId = db.prepare(`
SELECT discord_user_id, vrc_user_id FROM user_links WHERE vrc_user_id = ?
`);

const deleteByDiscordId = db.prepare(`
DELETE FROM user_links WHERE discord_user_id = ?
`);

export const create = (discordUserId: string, vrcUserId: string) =>
  insertOrUpdate.run({
    discord_user_id: discordUserId,
    vrc_user_id: vrcUserId,
  });

export const remove = (discordUserId: string) =>
  deleteByDiscordId.run(discordUserId);

export const byDiscordId = (discordUserId: string): DbRecord =>
  getByDiscordId.get(discordUserId) as DbRecord;

export const byVrcId = (discordUserId: string): DbRecord =>
  getByVrcId.get(discordUserId) as DbRecord;
