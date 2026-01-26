import { authService } from "@/lib/api/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        console.log("credentials", credentials);
        try {
          const response = await authService.login(credentials);
          console.log("response ", response);
          if (response.accessToken && response.refreshToken && response.user) {
            return {
              ...response.user,
              id: response.user._id,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || (user as any)._id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.user = user; // Store the entire user object
        token.accessTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes from now
        token.refreshTokenExpires = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days from now
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = { ...session.user, ...(token.user as any) }; // Merge all user properties
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).token = token.accessToken as string;
        (session.user as any).refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/test",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes for access token
  },

  jwt: {
    maxAge: 15 * 24 * 60 * 60, // 15 days for refresh token
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
