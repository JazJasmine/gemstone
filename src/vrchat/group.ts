import { vrchatBot } from '.';

const GROUP_ID = process.env.VRC_GROUP_ID!;
const BOT_ID = process.env.VRC_BOT_USER_ID!; // When the bot url is found, don't do anything about it

export const removeFromVrcGroup = async (vrcUserId: string) => {
  if (vrcUserId === BOT_ID) return;

  const result = await vrchatBot.kickGroupMember({
    path: { groupId: GROUP_ID, userId: vrcUserId },
  });

  if (result.error) {
    throw result.error;
  }
};

export const inviteToVrcGroup = async (vrcUserId: string) => {
  if (vrcUserId === BOT_ID) return;

  const result = await vrchatBot.createGroupInvite({
    path: { groupId: GROUP_ID },
    body: { userId: vrcUserId },
  });

  if (result.error) {
    throw result.error;
  }
};
