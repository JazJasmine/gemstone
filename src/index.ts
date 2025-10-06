import 'dotenv/config';
import './vrchat';
import { Events } from 'discord.js';
import { logger } from './utils/logger';
import { deployCommands, handleCommands } from './discord/deployCommands';
import messageCreate from './discord/messageCreate';
import guildMemberRemove from './discord/guildMemberRemove';
import { discordBot } from './discord';
import { checkForAgeInstances } from './vrchat/ageGate';
import { metricServer } from './metrics';

/* Discord Bot Setup */
discordBot.once(Events.ClientReady, async (readyClient) => {
  logger.info({ botUser: readyClient.user.displayName }, 'Discord bot ready!');

  // Commands
  readyClient.guilds.cache.forEach(async (guild) => {
    await deployCommands(guild.id);
  });
  handleCommands(readyClient);

  // Event Listeners
  messageCreate(readyClient);
  guildMemberRemove(readyClient);
});

discordBot.login(process.env.DISCORD_BOT_TOKEN);

/* VRC Bot Setup */
setInterval(() => {
  checkForAgeInstances();
}, 30000);

/* Metrics Server */
metricServer.listen(process.env.METRIC_SERVER_PORT, () => {
  logger.info('Metric server ready!');
});
