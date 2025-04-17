"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface LoginPageProps {
  clientId: string;
}

export function LoginPage({ clientId }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // GitHub OAuth configuration
  const redirectUri = `${
    process.env.NEXT_PUBLIC_APP_URL || window.location.origin
  }/api/auth/callback`;
  const scope = "repo"; // Read-only access to repositories

  const handleLogin = () => {
    setIsLoading(true);
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    router.push(authUrl);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            GitHub Repository Analyzer
          </CardTitle>
          <CardDescription className="text-center">
            Analyze your GitHub repositories and calculate contributor impact
            scores
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                There was a problem authenticating with GitHub. Please try
                again.
              </AlertDescription>
            </Alert>
          )}
          <div className="w-full max-w-sm">
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              {isLoading ? "Connecting..." : "Sign in with GitHub"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground text-center">
            This app requires read-only access to your GitHub repositories to
            analyze contributor data.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
