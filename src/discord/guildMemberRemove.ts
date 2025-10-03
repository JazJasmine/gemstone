import { Client } from 'discord.js';
import { discordLog } from '../utils/logger';
import { unlink } from '../utils/linkProfiles';
import { removeFromVrcGroup } from '../vrchat/group';
import { byDiscordId } from '../repository/link';

export default (client: Client) =>
  client.on('guildMemberRemove', async (member) => {
    const discordUserId = member.user.id;
    const link = byDiscordId(discordUserId);
    if (!link) {
      // User didn't have any linked VRC account. Do nothing
      return;
    }

    const result = unlink(discordUserId);

    if (!result.success) {
      discordLog(
        client,
        `Failed to remove a VRC user link, due a left user: ${discordUserId}->${link.vrc_user_id}\n\n${result.reason}`,
      );
      return;
    }

    try {
      await removeFromVrcGroup(link.vrc_user_id);
      discordLog(
        client,
        `Removed user from VRC Group, due to left user:\n${link.vrc_user_id}`,
      );
    } catch (err: any) {
      discordLog(
        client,
        `Failed to remove user from VRC Group during deletion request:\n${link.vrc_user_id}\n\n${err}`,
        0xd63509,
      );
    }
  });
