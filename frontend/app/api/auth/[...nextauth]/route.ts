import { getUserRole } from "@/lib/auth-utils";
import { CustomJWT } from "@/types/next-auth";
import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: {
      token: CustomJWT,
      account?: any,
      profile?: any,
    }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token; //assigned the access token
      }

      // Add user role based on email domain
      if (token.email) {
        token.role = getUserRole(token.email); //assigned the role based on the email
      }

      return token;
    },
    async session({ session, token }: {
      session: Session,
      token: CustomJWT,
    }) {
      // Send properties to the client
      if (session.user) {
        session.user.email = token.email; // we are using the email of the logged in user
        session.user.role = token.role
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
