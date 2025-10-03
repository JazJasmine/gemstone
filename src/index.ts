import { logger } from "./utils/logger";
import { Client, Events, GatewayIntentBits } from "discord.js";
import KeyvFile from "keyv-file";
import { VRChat } from "vrchat";

require("dotenv").config();

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
  logger.info({ botUser: readyClient.user.displayName }, "Discord bot ready!");
});

discordBot.login(process.env.DISCORD_BOT_TOKEN);

/* VRChat Bot */
const vrchatBot = new VRChat({
  application: {
    name: "Gemstone",
    version: "1.0.0",
    contact: "jazjasminedev@gmail.com",
  },
  keyv: new KeyvFile({ filename: "./cookie.json" }),
  authentication: {
    credentials: {
      username: process.env.VRC_USER_NAME!,
      password: process.env.VRC_PASSWORD!,
      totpSecret: process.env.VRC_TOTP_SECRET!,
    },
  },
});
