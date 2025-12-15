import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        // Fallback for demo if no google creds - careful with this in prod
        // CredentialsProvider(...) could be added here
    ],
    callbacks: {
        async session({ session, user, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = user.id
                // @ts-ignore
                session.user.role = user.role // Ensure we stick role in session
            }
            return session
        }
    }
}
