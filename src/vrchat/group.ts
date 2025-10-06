import { vrchatBot } from '.';
import { failedVrcGroupRemovalCounter } from '../metrics';
import { logger } from '../utils/logger';

const GROUP_ID = process.env.VRC_GROUP_ID!;
const BOT_ID = process.env.VRC_BOT_USER_ID!; // When the bot url is found, don't do anything about it

export const removeFromVrcGroup = async (vrcUserId: string) => {
  if (vrcUserId === BOT_ID) return;

  const result = await vrchatBot.kickGroupMember({
    path: { groupId: GROUP_ID, userId: vrcUserId },
  });

  // This usually means the user wasn't part of the group
  if (result.error?.message.includes("You don't have permission to do that")) {
    return;
  }

  if (result.error) {
    failedVrcGroupRemovalCounter.inc();
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

export const cancelGroupInvite = async (vrcUserId: string) => {
  if (vrcUserId === BOT_ID) return;

  const result = await vrchatBot.deleteGroupInvite({
    path: { groupId: GROUP_ID, userId: vrcUserId },
  });

  if (result.error?.message.includes("You can't uninvite")) return;

  if (result.error) {
    logger.error({ err: result.error });
  }
};
