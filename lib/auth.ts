import type { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

// MOCK: Using dummy values for preview mode
// In a real app, you would use environment variables:
// const githubClientId = process.env.GITHUB_CLIENT_ID
// const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
const githubClientId = "mock-github-client-id"
const githubClientSecret = "mock-github-client-secret"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      // MOCK: In preview mode, we'll bypass the real GitHub OAuth flow
      // This is for demonstration purposes only
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Store the GitHub access token in the token
      if (account) {
        token.accessToken = account.access_token
      }

      // MOCK: For preview, always provide a mock access token
      if (!token.accessToken) {
        token.accessToken = "mock-github-token-for-preview"
      }

      return token
    },
    async session({ session, token }) {
      // Make GitHub access token available to client
      session.accessToken = token.accessToken as string

      // MOCK: For preview, ensure user has an ID
      if (!session.user.id && token.sub) {
        session.user.id = token.sub
      } else if (!session.user.id) {
        session.user.id = "mock-user-id"
      }

      return session
    },
  },
  // MOCK: For preview, we'll use a hardcoded secret
  // In production, use a strong, randomly generated secret stored in environment variables
  secret: "mock-nextauth-secret-for-preview-only",

  // Custom pages for auth flows
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
