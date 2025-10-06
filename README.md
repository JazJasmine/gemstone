# Gemstone

_A Discord ↔ VRChat group sync and safety bot._

Gemstone keeps your Discord community and VRChat group perfectly aligned.  
It automates linking, cleanup, and safety enforcement, so staff can focus on community rather than admin work.  
Built in **TypeScript**, powered by **Discord.js**, and **privacy-first by design**, we only store data that is publicly available, i.e. your discord and vrc user id.

## Install URL

https://discord.com/oauth2/authorize?client_id=1342849770963603527&permissions=274877975616&integration_type=0&scope=bot

## ✨ Features

### 🔗 Automatic Linking

Members join the VRChat group by simply posting their **VRChat profile URL** (`https://vrchat.com/home/user/usr_...`) in a designated thread/channel.
Gemstone validates the link, stores it as a secure mapping, and invites the user to the VRChat group automatically.
If you wish to update your link, just post the vrc url again, it will overwrite your current link and remove the existing account from the group.

### 🧍 Self-Service Commands

| Command       | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `/showlink`   | Displays your currently linked VRChat account.              |
| `/removelink` | Unlinks your account and removes you from the VRChat group. |

### 🛠️ Staff Commands

| Command                   | Description                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/show vrcid:<usr_...>`   | Look up which Discord user is linked to a given VRChat ID (useful for incidents and investigations). |
| `/remove vrcid:<usr_...>` | Forcefully unlink a user and remove them from the VRChat group.                                      |

### 🧹 Automatic Cleanup

When a member **leaves**, **is kicked**, or **is banned**, Gemstone looks up their linked VRChat account, removes it from the group and deletes the mapping from the database.

### 🛡️ Instance Guard

- Periodically polls the **VRChat API** for active group instances.
- Automatically **closes non–age-gated** instances and logs them to a staff channel.

### 📜 Staff Log Channel

All major actions are logged in a single, centralized staff log:

## 🗄️ Data Model

Gemstone stores only two identifiers in SQLite (file-based db):

| Column        | Description                              |
| ------------- | ---------------------------------------- |
| `discord_id`  | The Discord user ID                      |
| `vrc_user_id` | The permanent VRChat user ID (`usr_...`) |

No display names, messages, or timestamps are collected.

## 🧩 Permissions

Gemstone requires:

Discord Intents:

- Guilds
- GuildMembers
- GuildMessages
- MessageContent,
- GuildMessageReactions

Discord Role Permissions (only for the group join channel and the log channel):

- View Channel
- Read Message History
- Send Messages
- Add Reactions
