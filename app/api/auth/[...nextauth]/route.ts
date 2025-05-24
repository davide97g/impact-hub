import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// MOCK: For preview, we'll use a simplified NextAuth handler
// In production, this would connect to the real GitHub OAuth API
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
