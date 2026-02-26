import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "../db/connection"
import { users } from "../db/models"
import { compare } from "bcryptjs"
import { eq } from "drizzle-orm"
import { AuthOptions } from "next-auth"
import jwt from "jsonwebtoken"

export const authOptions: AuthOptions = {

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {}
      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) return null

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.trim()))
          .limit(1)

        if (!user.length) return null

        const valid = await compare(
          credentials.password,
          user[0].password
        )

        if (!valid) return null

        return {
          id: user[0].id.toString(),
          email: user[0].email
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {

    async jwt({ token, user }) {

      if (user) {

        // ⭐ Generate Access Token
        const accessToken = jwt.sign(
          {
            id: user.id,
            email: user.email
          },
          process.env.NEXTAUTH_SECRET!,
          {
            expiresIn: "15m" // 🔥 Short lived security token
          }
        )

        token.id = user.id
        token.email = user.email
        token.accessToken = accessToken
      }

      return token
    },

    async session({ session, token }) {

      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.accessToken = token.accessToken as string
      }

      return session
    }

  },

  pages: {
    signIn: "/login"
  },

  secret: process.env.NEXTAUTH_SECRET
}