const URL_REG_EX = /https?:\/\/[^\s)>\]]+/gi;

/**
 * Parses a message for urls and extract a possible VRC user id:
 * https://vrchat.com/home/user/usr_xxxxx -> usr_xxxxx
 */
export const parseVrcUserId = (messageContent: string): string | undefined => {
  const urls = messageContent.match(URL_REG_EX);

  if (!urls) {
    return;
  }

  for (const u of urls) {
    const url = new URL(u);
    const host = url.hostname.toLowerCase();
    if (host !== 'vrchat.com' && host !== 'www.vrchat.com') continue;

    // Typical profile pattern: /home/user/usr_xxx
    // Also handle occasional trailing slashes or params
    const path = url.pathname.toLowerCase();
    const match = path.match(/\/home\/user\/(usr_[a-z0-9-]{8,})/i);
    if (match) return match[1];

    // Fallback: look for usr_ in the whole URL (path or query) just in case
    const fallback = u.match(/\busr_[A-Za-z0-9-]{8,}\b/);
    if (fallback) return fallback[0];
  }
};
