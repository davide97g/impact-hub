import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import Link from "next/link"
import { HeroBackground } from "@/components/hero-background"

// MOCK: For preview, we'll skip the real authentication check
// In production, this would use getServerSession to check if the user is logged in
export default function Home() {
  // MOCK: For preview, we'll assume the user is not logged in
  const isLoggedIn = false

  // MOCK: If logged in, we would redirect to dashboard
  // For preview, we'll just render the landing page

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <HeroBackground />
      </div>

      <div className="container relative z-10 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            AI-Powered Code Reviews
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Improve your pull requests with intelligent, AI-powered code reviews that help your team write better code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            title="GitHub Integration"
            description="Seamlessly connect your repositories and get automatic reviews on every PR."
            icon="🔄"
          />
          <FeatureCard
            title="Local & Cloud LLMs"
            description="Use Ollama locally during development or OpenAI in production."
            icon="☁️"
          />
          <FeatureCard
            title="Quality Metrics"
            description="Get detailed scores on complexity, readability, cleanliness, and robustness."
            icon="📊"
          />
        </div>

        <div className="flex justify-center">
          <Button className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg" asChild>
            <Link href="/dashboard">
              <Github className="mr-2 h-5 w-5" />
              {/* MOCK: For preview, link directly to dashboard instead of sign-in */}
              Try Demo
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader>
        <div className="text-3xl mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
