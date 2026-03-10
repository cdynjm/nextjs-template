
import { CallbacksOptions } from "next-auth";
import jwt from "jsonwebtoken";
import { generateKey, encrypt } from "../security/cipher";

export const authCallbacks: Partial<CallbacksOptions> = {
  async jwt({ token, user, trigger, session }) {
    if (user) {
      const accessToken = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: "12h" }
      );

      const key = await generateKey();

      token.encrypted_id = await encrypt(user.id, key);
      token.email = user.email;
      token.name = user.name;
      token.accessToken = accessToken;
    }

    if (trigger === "update" && session?.user) {
      token.name = session.user.name;
      token.email = session.user.email;
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.encrypted_id = token.encrypted_id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.accessToken = token.accessToken as string;
    }

    return session;
  },
};