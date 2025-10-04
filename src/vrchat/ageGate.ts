import { vrchatBot } from '.';
import { discordBot } from '../discord';
import { byVrcId } from '../repository/link';
import { discordLog, logger } from '../utils/logger';

export const checkForAgeInstances = async () => {
  try {
    const result = await vrchatBot.getGroupInstances({
      path: { groupId: process.env.VRC_GROUP_ID! },
    });

    if (result.data) {
      for (const instance of result.data) {
        const result = await vrchatBot.getInstance({
          path: {
            worldId: instance.world.id,
            instanceId: instance.instanceId,
          },
        });

        if (result.data && !result.data.ageGate) {
          if (result.data.closedAt !== null) {
            // Instance already has been closed.
            continue;
          }

          const vrcUserId = (result.data as unknown as any).creatorId as string;
          const link = byVrcId(vrcUserId);
          const discordUserId = link && link.discord_user_id;

          discordLog(
            discordBot,
            `Found non-age-gated instance in the group, closing...\n\nInstance Creator: ${vrcUserId} (<@${discordUserId}>)`,
            0xd63509,
          );

          try {
            await vrchatBot.closeInstance({
              path: {
                worldId: instance.world.id,
                instanceId: instance.instanceId,
              },
            });
          } catch (err) {
            discordLog(
              discordBot,
              `Failed to close the instance.\n\nError: ${err}`,
              0xd63509,
            );
          }
        }
      }
    }
  } catch (err) {
    logger.error(err);
    discordLog(
      discordBot,
      `Error during group instance checking.\n\nError: ${err}`,
      0xd63509,
    );
  }
};
