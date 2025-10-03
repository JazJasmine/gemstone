import 'dotenv/config';
import './vrchat';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { logger } from './utils/logger';
import { deployCommands, handleCommands } from './discord/deployCommands';
import messageCreate from './discord/messageCreate';
import guildMemberRemove from './discord/guildMemberRemove';

/* Discord Bot*/
const discordBot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

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
