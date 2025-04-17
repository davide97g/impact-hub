import { LoginPage } from "@/components/login-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  // Check if user is already authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("github_session");

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect("/dashboard");
  }

  // GitHub OAuth configuration
  const clientId = process.env.GITHUB_CLIENT_ID || "YOUR_GITHUB_CLIENT_ID";

  return <LoginPage clientId={clientId} />;
}
