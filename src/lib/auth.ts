import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        
        // Dynamically assign ADMIN or SUPER_ADMIN role based on ENV if the user logs in
        if (ADMIN_EMAILS.includes(user.email as string)) {
           const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
           if (dbUser && dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPER_ADMIN') {
              await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' }
              });
              token.role = 'ADMIN';
           } else if (dbUser) {
              token.role = dbUser.role;
           }
        } else {
           const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
           if (dbUser) token.role = dbUser.role;
        }
      }
      
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
