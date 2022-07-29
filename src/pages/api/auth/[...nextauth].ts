/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NextAuth, { NextAuthOptions, User } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { makeCredentialsManager } from "../../../server/application/factories/makeCredentialsManager";
import { getPrismaClient } from "../../../server/application/factories/getPrismaClient";

const prisma = getPrismaClient();
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: "supersecretstring",
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (user) {
        token.id = user.id;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      return Promise.resolve(session);
    },
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.password || !credentials?.email) {
          return null;
        }
        const credentialsManager = makeCredentialsManager();
        const userResponse = await credentialsManager.loginUser({
          email: credentials!.email,
          password: credentials!.password,
        });

        if (userResponse.status === 200 && userResponse.data) {
          console.log(userResponse.data);
          return {
            name: userResponse.data.name,
            email: userResponse.data.email,
            username: userResponse.data.username,
            id: userResponse.data.id,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & {
      id: string;
      username?: string;
    };
  }
}
