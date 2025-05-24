import { DashboardHeader } from "@/components/dashboard-header"
import { RepoSelector } from "@/components/repo-selector"
import { RecentReviews } from "@/components/recent-reviews"
import { getRepositories, getEnabledRepositories } from "@/lib/github"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsPanel } from "@/components/stats-panel"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

// MOCK: For preview, we'll create a mock user
const mockUser = {
  id: "mock-user-id",
  name: "Demo User",
  email: "user@example.com",
  image: "https://github.com/identicons/app/oauth_app/1234",
}

export default async function DashboardPage() {
  // MOCK: For preview, we'll skip the real authentication check
  // In production, this would redirect unauthenticated users

  // MOCK: For preview, we'll use mock data instead of real API calls
  const repositories = await getRepositories({ user: mockUser, accessToken: "mock-token" } as any)
  const enabledRepos = await getEnabledRepositories(mockUser.id)

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={mockUser} />

      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Suspense
              fallback={
                <div className="py-8 text-center">
                  <LoadingSpinner />
                </div>
              }
            >
              <StatsPanel />
              <RecentReviews />
            </Suspense>
          </TabsContent>

          <TabsContent value="repositories">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Repositories</CardTitle>
                <CardDescription>Select which repositories to enable AI code reviews for</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="py-8 text-center">
                      <LoadingSpinner />
                    </div>
                  }
                >
                  <RepoSelector repositories={repositories} enabledRepos={enabledRepos} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>AI Settings</CardTitle>
                <CardDescription>Configure AI model settings for code reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <OpenAISettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function OpenAISettings() {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <h3 className="text-lg font-medium">OpenAI API Settings</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          For production use, provide your OpenAI API key. During local development, Ollama will be used instead.
        </p>
      </div>

      <form className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            OpenAI API Key
          </label>
          <input id="apiKey" type="password" placeholder="sk-..." className="p-2 border rounded-md" />
          <p className="text-xs text-gray-500">Your API key is stored securely and only used for your code reviews</p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="model" className="text-sm font-medium">
            Model
          </label>
          <select id="model" className="p-2 border rounded-md" defaultValue="gpt-4">
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
        </div>

        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Save Settings
        </button>
      </form>
    </div>
  )
}
