import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  GuildMemberRoleManager,
} from 'discord.js';
import { byDiscordId } from '../../repository/link';
import { unlink } from '../../utils/linkProfiles';
import { cancelGroupInvite, removeFromVrcGroup } from '../../vrchat/group';
import { discordLog } from '../../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('remove')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Only users that have this permission will see this command
  .setDescription('Manually unlink a users vrc and discord account')
  .addUserOption((option) =>
    option
      .setName('target')
      .setDescription('The member to unlink')
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

  const user = interaction.options.getUser('target', true);
  const link = byDiscordId(user.id);
  if (!link) {
    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content: '✅ Removed linked VRC account',
    });
    return;
  }

  const unlinkResult = unlink(user.id);
  if (!unlinkResult.success) {
    interaction.reply({
      flags: MessageFlags.Ephemeral,
      content:
        '❌ Sorry something went wrong. If that issue persists, please reach out to a Jaz, lol.',
    });
    return;
  }

  try {
    await removeFromVrcGroup(link.vrc_user_id);
    discordLog(
      interaction.client,
      `Removed user from VRC Group, due to manual removal (ADMIN):\n${link.vrc_user_id}`,
    );
  } catch (err: any) {
    discordLog(
      interaction.client,
      `Failed to remove user from VRC Group during manual removal (ADMIN):\n${link.vrc_user_id}\n\n${err}`,
      0xd63509,
    );
  }

  await cancelGroupInvite(link.vrc_user_id);

  interaction.reply({
    flags: MessageFlags.Ephemeral,
    content: '✅ Removed linked VRC account',
  });
};
