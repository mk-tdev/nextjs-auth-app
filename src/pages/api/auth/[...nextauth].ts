import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "../../../../lib/db";
import { verifyPassword } from "../../../../lib/auth";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials: any) {
        // Add logic to verify user credentials
        const { email, password } = credentials as any;

        const client = await connectToDB();
        const db = client.db();
        // Check if user with the given email exists
        const user = await db.collection("users").findOne({ email });
        if (!user) {
          await client.close();
          throw new Error("no users found with the given email");
        }

        // Verify the password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          await client.close();
          throw new Error("Invalid email or password");
        }

        await client.close();

        return {
          email: user.email,
        };
      },
    } as any),
  ],
};

export default NextAuth(authOptions);
