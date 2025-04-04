import { toast } from "@/hooks/use-toast";
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${backendDomain}/get_all_students/`);
          const data = (await response.json()) as Student[];
          const isStudent = data.some((student) => student.email === (user as any).email);
          (user as any).role = isStudent ? "student" : "viewer";
          if (isStudent) {
            const studentActivationResponse = await fetch(`${backendDomain}/activate_student/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ email: (user as any).email.toString() })
            })
            if (!studentActivationResponse.ok) {
              throw new Error("Unable to activate the error")
            }
            toast({
              title: "Account Activated",
              description: await studentActivationResponse.json().then((res) => res.message),
              variant: "default",
            })
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          (user as any).role = "viewer"; // Default to viewer on error
        }
      }
      return true; // Allow sign-in
    },


    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.role = (user as any).role;
        token.sub = user.id; // Store the unique ID
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/courses`;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error"
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
