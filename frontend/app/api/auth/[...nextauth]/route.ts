import { backendDomain, Student } from "@/types/types";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Viewer Login",
      credentials: {
        login: {
          label: "Login",
          type: "text"
        },
        name: {
          label: "Name",
          type: "text"
        }
      },
      async authorize(credentials) {
        const { login, name } = credentials as { login: string; name: string }
        if (!login || !name) {
          return null;
        }
        return {
          id: login,
          login,
          name,
          role: "viewer"
        }
      }
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
          console.log("Fetching students...");
          const response = await fetch(`${backendDomain}/get_all_students/`);
          if (!response.ok) throw new Error("Failed to fetch students");

          const data = (await response.json()) as Student[];
          console.log("Student Data:", data);

          const userEmail = (user as any).email;
          console.log("User Email:", userEmail);

          const isStudent = data.some((student) => student.email === userEmail);
          console.log("Is Student:", isStudent);

          (user as any).role = isStudent ? "student" : "viewer";

          if (isStudent) {
            console.log("Activating student...");
            const studentActivationResponse = await fetch(
              `${backendDomain}/activate_student/`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
              }
            );

            if (!studentActivationResponse.ok) {
              throw new Error("Unable to activate the student");
            }

            const activationMessageBody = await studentActivationResponse.json();
            console.log("Activation Response:", activationMessageBody.message);
          }
        } catch (error) {
          console.error("Error during sign-in:", error);
          (user as any).role = "viewer"; // Default to viewer on error
        }
      }
      return true; // Allow sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = (user as any).email;
        token.role = (user as any).role ?? "viewer";
        token.sub = user.id; // Store the unique ID
      }
      console.log("JWT Token:", token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      console.log("Session Data:", session);
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/custom-home`;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error"
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
