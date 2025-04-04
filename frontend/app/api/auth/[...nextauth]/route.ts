import { backendDomain, Student } from "@/types/types";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          const response = await fetch(`${backendDomain}/get_all_students/`);
          const data = await response.json() as Student[]
          const isStudent = data.some(student => student.email === user.email)
          token.role = isStudent ? "student" : "viewer"
          token.email = user.email
        }
        catch (error) {
          console.error('Error fetching students:', error);
          token.role = "viewer";
          token.email = user.email;

        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string,
          session.user.role = token.role as string
      }
      return session
    },

    async redirect({ url, baseUrl

    }) {
      return baseUrl + "/courses"
    }
  },
  pages: {
    signIn: "/",
    error: "/auth/error"
  }
}

export default NextAuth(authOptions);