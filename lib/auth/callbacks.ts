
import { CallbacksOptions } from "next-auth";
import jwt from "jsonwebtoken";

export const authCallbacks: Partial<CallbacksOptions> = {
  async jwt({ token, user, trigger, session }) {
    if (user) {
      const accessToken = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: "12h" }
      );

      token.id = user.id;
      token.email = user.email;
      token.name = user.name;
      token.role = user.role;
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
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
    }

    return session;
  },
};