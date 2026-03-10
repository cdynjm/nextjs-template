import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { AuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import { encrypt, generateKey } from "../security/cipher";
import { prisma } from "@/lib/db/prisma";

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

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email.trim(),
          },
        });

        if (!user) return null;

        const valid = await compare(credentials.password, user.password);

        if (!valid) return null;

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

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      
      if (user) {
        const accessToken = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          process.env.NEXTAUTH_SECRET!,
          {
            expiresIn: "12h",
          },
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
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
