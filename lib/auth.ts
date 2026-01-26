import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email"   },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a mock implementation. In a real app, you would validate against your database
        if (!credentials?.email || !credentials?.password) return null
        
        // Mock user for demonstration
        if (credentials.email === "user@example.com" && credentials.password === "password") {
          return {
            id: "1",
            name: "John Doe",
            email: "user@example.com",
            role: "user",
            token: "mock-token",
            refreshToken: "mock-refresh-token"
          }
        }
        
        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ""
    })
  ],
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes for access token
  },

  jwt: {
    maxAge: 15 * 24 * 60 * 60, // 15 days for refresh token
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.token = (user as any).token
        token.refreshToken = (user as any).refreshToken
        token.accessTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes from now
        token.refreshTokenExpires = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days from now
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as "owner" | "user" | "agent"
        session.user.token = token.token as string
        session.user.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
}