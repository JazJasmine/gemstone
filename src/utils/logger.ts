import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import pino from 'pino';

export const logger = pino({
  base: null, // Removes pid and hostname
  timestamp: pino.stdTimeFunctions.isoTime,
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level(label) {
      return { level: label }; // This returns { level: 'info' } instead of { level: 30 }
    },
  },
});

export const discordLog = async (
  client: Client,
  content: string,
  color = 0x2ecc71,
) => {
  try {
    const channel = await client.channels.fetch(
      process.env.DISCORD_LOG_CHANNEL!,
    );
    if (!channel || !channel.isTextBased()) return;

    // simple embed (better than raw text)
    const embed = new EmbedBuilder()
      .setDescription(content)
      .setColor(color)
      .setTimestamp();

    (channel as TextChannel).send({ embeds: [embed] });
  } catch (err) {
    logger.error(err);
  }
};
