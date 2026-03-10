import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { authCallbacks } from "./callbacks";
import { authorizeUser } from "./authorize";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      authorize: authorizeUser,
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