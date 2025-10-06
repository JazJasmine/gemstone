import { failedLinkRemovalCounter } from '../metrics';
import { byDiscordId, create, remove } from '../repository/link';
import { logger } from './logger';

type LinkSuccess = { success: true; newLink: boolean; prevVrcUserId?: string };
type LinkError = { success: false; reason: string };

type UnlinkSuccess = { success: true };
type UnlinkError = { success: false; reason: string };

export const link = (
  discordUserId: string,
  vrcUserId: string,
): LinkSuccess | LinkError => {
  try {
    // Check if the user already linked a vrc profile:
    const existingLink = byDiscordId(discordUserId);

    create(discordUserId, vrcUserId);
    return {
      success: true,
      newLink: existingLink === undefined,
      prevVrcUserId: existingLink && existingLink.vrc_user_id,
    };
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, reason: 'VRC_ID_TAKEN' } as LinkError;
    }

    logger.error({ err, discordUserId, vrcUserId }, 'Failed to create a link');
    return { success: false, reason: 'DB_ERROR', error: err } as LinkError;
  }
};

export const unlink = (discordUserId: string): UnlinkSuccess | UnlinkError => {
  try {
    remove(discordUserId);
    return { success: true };
  } catch (err: any) {
    failedLinkRemovalCounter.inc();
    logger.error({ err, discordUserId }, 'Failed to remove a link');
    return { success: false, reason: 'DB_ERROR', error: err } as LinkError;
  }
};
