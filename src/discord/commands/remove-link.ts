import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';
import { byDiscordId } from '../../repository/link';
import { discordLog } from '../../utils/logger';
import { cancelGroupInvite, removeFromVrcGroup } from '../../vrchat/group';
import { unlink } from '../../utils/linkProfiles';

export const data = new SlashCommandBuilder()
  .setName('removelink')
  .setDescription(
    'Removes your linked VRC account. THIS WILL REMOVE YOU FROM THE VRC GROUP',
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guild) return;

  const link = byDiscordId(interaction.user.id);
  if (!link) {
    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content: '✅ Removed your linked VRC account',
    });
    return;
  }

  const unlinkResult = unlink(interaction.user.id);
  if (!unlinkResult.success) {
    discordLog(
      interaction.client,
      `Failed to remove a VRC user link on request: ${interaction.user.id}\n\n${unlinkResult.reason}`,
      0xd63509,
    );

    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content:
        '❌ Sorry something went wrong. If that issue persists, please reach out to a mod.',
    });
    return;
  }

  try {
    await removeFromVrcGroup(link.vrc_user_id);
    discordLog(
      interaction.client,
      `Removed user from VRC Group, due to deletion request:\n${link.vrc_user_id}`,
    );
  } catch (err: any) {
    discordLog(
      interaction.client,
      `Failed to remove user from VRC Group during deletion request:\n${link.vrc_user_id}\n\n${err}`,
      0xd63509,
    );
  }

  await cancelGroupInvite(link.vrc_user_id);

  interaction.reply({
    flags: MessageFlags.Ephemeral,
    content: '✅ Removed your linked VRC account',
  });
  return;
};
