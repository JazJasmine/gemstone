import { VRChat } from 'vrchat';
import KeyvFile from 'keyv-file';

export const vrchatBot = new VRChat({
  application: {
    name: 'Gemstone',
    version: '1.0.0',
    contact: 'jazjasminedev@gmail.com',
  },
  keyv: new KeyvFile({ filename: './cookie.json' }),
  authentication: {
    credentials: {
      username: process.env.VRC_USER_NAME!,
      password: process.env.VRC_PASSWORD!,
      totpSecret: process.env.VRC_TOTP_SECRET!,
    },
  },
});
