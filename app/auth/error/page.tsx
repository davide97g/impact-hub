import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error || "An unknown error occurred"

  let errorMessage = "There was a problem signing you in."

  // Provide more specific error messages based on the error code
  switch (error) {
    case "Configuration":
      errorMessage = "There is a problem with the server configuration. Please contact support."
      break
    case "AccessDenied":
      errorMessage = "You do not have permission to sign in."
      break
    case "Verification":
      errorMessage = "The verification link is invalid or has expired."
      break
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
    case "Callback":
    case "OAuthAccountNotLinked":
    case "EmailSignin":
    case "CredentialsSignin":
      errorMessage = "There was a problem with the authentication service. Please try again."
      break
    default:
      errorMessage = "An unexpected error occurred. Please try again."
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription className="text-red-500">{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p className="text-center text-sm text-gray-500">Error code: {error}</p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/api/auth/signin">Try Again</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
