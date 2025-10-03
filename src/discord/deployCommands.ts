import { ChatInputCommandInteraction, Client, REST, Routes } from 'discord.js';
import { commands } from './commands';
import { logger } from '../utils/logger';

const commandsData = Object.values(commands).map(
  (command: any) => command.data,
);

const rest = new REST({ version: '10' }).setToken(
  process.env.DISCORD_BOT_TOKEN!,
);

export const deployCommands = async (guildId: string) => {
  try {
    logger.info(`Started refreshing application (/) commands for ${guildId}.`);

    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_APP_ID!, guildId),
      {
        body: commandsData,
      },
    );

    logger.info(
      `Successfully reloaded application (/) commands for ${guildId}.`,
    );
  } catch (err) {
    logger.error(err);
  }
};

export const handleCommands = (discordBot: Client) => {
  // Command Handling
  discordBot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
      return;
    }

    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
      commands[commandName as keyof typeof commands].execute(
        interaction as ChatInputCommandInteraction,
      );
    }
  });
};
