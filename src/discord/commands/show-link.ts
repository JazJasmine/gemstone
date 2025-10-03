import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';
import { byDiscordId } from '../../repository/link';

const vrcProfileBase = 'https://vrchat.com/home/user';

export const data = new SlashCommandBuilder()
  .setName('showlink')
  .setDescription(
    'Shows the vrc account that is linked to your discord account',
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guild) return;

  const result = byDiscordId(interaction.user.id);
  if (!result) {
    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content: 'Your Discord account currently is not linked to any VRC user',
    });
    return;
  }

  interaction.reply({
    flags: MessageFlags.Ephemeral,
    content: `Your Discord account is linked to the following account: ${vrcProfileBase}/${result.vrc_user_id}`,
  });
  return;
};
