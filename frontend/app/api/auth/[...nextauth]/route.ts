import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserRole } from "@/lib/auth-utils";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      
      // Add user role based on email domain
      if (token.email) {
        token.role = getUserRole(token.email);
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };