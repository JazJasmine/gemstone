import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  GuildMemberRoleManager,
} from 'discord.js';
import { byVrcId } from '../../repository/link';

export const data = new SlashCommandBuilder()
  .setName('show')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Only users that have this permission will see this command
  .setDescription('Shows the Discord account that is linked to the VRC account')
  .addStringOption((option) =>
    option
      .setName('vrcuserid')
      .setDescription('The VRChat profile ID (usr_...)')
      .setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guild) return;

  if (
    !(interaction.member?.roles as GuildMemberRoleManager).cache.has(
      process.env.DISCORD_ADMIN_ROLE_ID!,
    )
  ) {
    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content: 'You are not authorized to use this command.',
    });
    return;
  }

  const vrcUserId = interaction.options.getString('vrcuserid', true);
  const result = byVrcId(vrcUserId);
  if (!result) {
    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content: 'No Discord account is linked to this VRC account.',
    });
    return;
  }

  const user = interaction.client.users.cache.get(result.discord_user_id);
  interaction.reply({
    flags: MessageFlags.Ephemeral,
    content: `This VRC account is linked to following discord user: <@${result.discord_user_id}> (${result.discord_user_id})`,
  });
  return;
};
