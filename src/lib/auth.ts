import bcrypt from "bcrypt";
import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { getServerSession } from "next-auth/next";
import { rateLimit } from "./rateLimit";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string;
      createdAt?: string;
      phone?: string;
      countryCode?: string;
      fullPhone?: string;
    } & DefaultSession["user"];
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Boedi Ono" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text", placeholder: "Boedi Ono" },
      },

      async authorize(credentials) {
        // check to see if eamil and password is there
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email or password");
        }

         // Limit: 5 login attempts per minute per email
         const limitResult = await rateLimit(credentials.email);

         if (!limitResult.success) {
           throw new Error("Too many login attempts, please try again later");
         }

        // check to see if user already exist
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // if user was not found
        if (!user || !user?.password) {
          throw new Error("No user found");
        }

        // check to see if passwords match
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        // console.log("User authenticated:", { email: user.email, role: user.role });
        return user;
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    jwt: async (payload: any) => {
      const { token, user } = payload;
      if (user) {
        // console.log("JWT Callback - User data:", { id: user.id, role: user.role, createdAt: user.createdAt });
        return {
          ...token,
          id: user.id,
          role: user.role,
          name: user.name,
          createdAt: user.createdAt,
          phone: user.phone,
          countryCode: user.countryCode,
          fullPhone: user.fullPhone,
        };
      }
      // console.log("JWT Callback - Token data:", { id: token.id, role: token.role, createdAt: token.createdAt });
      return token;
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.createdAt = token.createdAt as string;
        session.user.phone = token.phone as string;
        session.user.countryCode = token.countryCode as string;
        session.user.fullPhone = token.fullPhone as string;
        // console.log("Session Callback - Session data:", { 
        //   id: session.user.id, 
        //   role: session.user.role,
        //   email: session.user.email,
        //   createdAt: session.user.createdAt
        // });
        return session;
      }
      return session;
    },

  },
  debug:process.env.NODE_ENV === "development",
};


export async function authenticate() {
  const session = await getServerSession(authOptions);
  console.log("Authenticate function - Session:", session);
  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
    console.log("Authentication failed - No session or insufficient role");
    return null;
  }
  return session;
}

