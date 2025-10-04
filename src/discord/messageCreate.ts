import { discordLog, logger } from '../utils/logger';
import { Client } from 'discord.js';
import { parseVrcUserId } from '../utils/parse';
import { link } from '../utils/linkProfiles';
import { inviteToVrcGroup, removeFromVrcGroup } from '../vrchat/group';

export default (client: Client) =>
  client.on('messageCreate', async (msg) => {
    if (msg.author.bot) {
      return;
    }

    if (msg.channel.id !== process.env.DISCORD_VRC_GROUP_CHANNEL) {
      return;
    }

    logger.debug('Incoming Message in VRC Group Channel');

    if (!msg.content.includes('/usr_')) {
      msg.react('❌');
      msg.reply(
        "❌ That doesn't look like a VRChat profile link.\nPlease post your profile URL (e.g. <https://vrchat.com/home/user/usr_xxxxx>) so we can link you.",
      );
      return;
    }

    const vrcUserId = parseVrcUserId(msg.content);
    if (!vrcUserId) {
      msg.react('❌');
      msg.reply(
        "❌ That doesn't look like a VRChat profile link.\nPlease post your profile URL (e.g. <https://vrchat.com/home/user/usr_xxxxx>) so we can link you.",
      );
      return;
    }

    const discordUserId = msg.author.id;
    const result = link(discordUserId, vrcUserId);

    if (!result.success) {
      discordLog(
        client,
        `Failed to add a VRC user link: ${discordUserId}->${vrcUserId}\n\n${result.reason}\n\n${msg.url}`,
        0xd63509,
      );

      msg.reply({
        content:
          '❌ Sorry something went wrong linking your account. If that issue persists, please reach out to a mod.',
      });
      return;
    }

    if (!result.newLink && result.prevVrcUserId) {
      if (vrcUserId === result.prevVrcUserId) {
        msg.react('✅');
        return;
      }

      logger.info(
        {
          discordUserId,
          prevVrcUserId: result.prevVrcUserId,
          nextVrcUserId: vrcUserId,
        },
        'Updated a users link',
      );

      // Remove old Account, if it fails, just log it
      try {
        await removeFromVrcGroup(result.prevVrcUserId);
        discordLog(
          client,
          `Removed user from VRC Group, due to link update:\n${result.prevVrcUserId}\n-> ${vrcUserId}\n\n${msg.url}`,
        );
      } catch (err: any) {
        discordLog(
          client,
          `Failed to remove user from VRC Group during link update:\n${result.prevVrcUserId}\n\n${err}\n\n${msg.url}`,
          0xd63509,
        );
      }
    }

    try {
      await inviteToVrcGroup(vrcUserId);
      discordLog(client, `Inviting user to group:\n${vrcUserId}\n\n${msg.url}`);

      msg.react('✅');
    } catch (err: any) {
      if (err.message.includes('is already a member of this group')) {
        msg.react('✅');
        return;
      }

      discordLog(
        client,
        `Failed to invite user to VRC Group during linking:\n${vrcUserId}\n\n${err}\n\n${msg.url}`,
        0xd63509,
      );

      msg.react('⚠️');
      msg.reply(
        '⚠️ Something went wrong trying to invite you to the VRC Group. Please try again or contact a mod',
      );
      return;
    }
  });
