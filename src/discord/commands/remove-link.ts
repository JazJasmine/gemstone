import {
  SlashCommandBuilder,
  type CommandInteraction,
  MessageFlags,
} from 'discord.js';
import { byDiscordId, remove } from '../../repository/link';
import { discordLog } from '../../utils/logger';
import { removeFromVrcGroup } from '../../vrchat/group';

const vrcProfileBase = 'https://vrchat.com/home/user';

export const data = new SlashCommandBuilder()
  .setName('removelink')
  .setDescription(
    'Removes your linked VRC account. THIS WILL REMOVE YOU FROM THE VRC GROUP',
  );

export const execute = async (interaction: CommandInteraction) => {
  if (!interaction.guild) return;

  const result = byDiscordId(interaction.user.id);
  if (!result) {
    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content: '✅ Removed your linked VRC account',
    });
    return;
  }

  try {
    remove(interaction.user.id);
  } catch (err) {
    discordLog(
      interaction.client,
      `Failed to remove a VRC user link on request: ${interaction.user.id}\n\n${err}`,
    );

    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content:
        '❌ Sorry something went wrong. If that issue persists, please reach out to a mod.',
    });
    return;
  }

  try {
    await removeFromVrcGroup(result.vrc_user_id);
    discordLog(
      interaction.client,
      `Removed user from VRC Group, due to deletion request:\n${result.vrc_user_id}`,
    );
  } catch (err: any) {
    discordLog(
      interaction.client,
      `Failed to remove user from VRC Group during deletion request:\n${result.vrc_user_id}\n\n${err}`,
      0xd63509,
    );
  }

  interaction.reply({
    flags: MessageFlags.Ephemeral,
    content: '✅ Removed your linked VRC account',
  });
  return;
};
