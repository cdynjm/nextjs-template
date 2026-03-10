import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { AuthOptions } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit, resetRateLimit } from "@/lib/auth/rate-limiter";
import { authCallbacks } from "./callbacks";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim();

        if (checkRateLimit(email)) {
          throw new Error("Too many login attempts. Try again in 5 minutes.");
        }

        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) throw new Error("Invalid email or password");

        const valid = await compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid email or password");

        resetRateLimit(email);

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: authCallbacks,

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
