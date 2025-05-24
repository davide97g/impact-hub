import type { Session } from "next-auth"

/**
 * MOCK: Fetch GitHub repositories for the authenticated user
 * In a real app, this would make API calls to GitHub
 */
export async function getRepositories(session: Session) {
  // MOCK: Return mock repositories for preview
  // In production, this would use the GitHub API with the access token
  return [
    {
      id: 1,
      name: "website",
      full_name: "acme/website",
      description: "Company website and landing pages",
      private: false,
      html_url: "https://github.com/acme/website",
    },
    {
      id: 2,
      name: "api",
      full_name: "acme/api",
      description: "Backend API for the main product",
      private: true,
      html_url: "https://github.com/acme/api",
    },
    {
      id: 3,
      name: "mobile-app",
      full_name: "acme/mobile-app",
      description: "Mobile application codebase",
      private: true,
      html_url: "https://github.com/acme/mobile-app",
    },
    {
      id: 4,
      name: "docs",
      full_name: "acme/docs",
      description: "Documentation website",
      private: false,
      html_url: "https://github.com/acme/docs",
    },
    {
      id: 5,
      name: "design-system",
      full_name: "acme/design-system",
      description: "UI component library and design system",
      private: false,
      html_url: "https://github.com/acme/design-system",
    },
  ]
}

/**
 * MOCK: Get repositories that have been enabled for code reviews
 * In a real app, this would query a database
 */
export async function getEnabledRepositories(userId: string) {
  // MOCK: Return mock enabled repositories for preview
  // In a real implementation, fetch from database
  return [1, 3, 5] // Repository IDs that are enabled
}

/**
 * MOCK: Set up a GitHub webhook for a repository
 * In a real app, this would create a webhook via the GitHub API
 */
export async function setupWebhook(repoId: number, accessToken: string) {
  // MOCK: For preview, just return success
  // In a real implementation:
  // 1. Create a webhook on the GitHub repository
  // 2. Store the webhook ID in the database
  // 3. Return success/failure

  return { success: true, webhookId: `mock-webhook-${repoId}` }
}

/**
 * MOCK: Get the diff and context for a pull request
 * In a real app, this would fetch data from the GitHub API
 */
export async function getPullRequestDetails(repoFullName: string, prNumber: number, accessToken: string) {
  // MOCK: Return mock PR details for preview
  // In a real implementation, this would use the GitHub API
  return {
    title: "Add new landing page components",
    description: "This PR adds several new components for the landing page redesign.",
    author: "johndoe",
    base: "main",
    head: "feature-branch",
    files: [
      {
        filename: "src/components/Button.tsx",
        status: "modified",
        additions: 15,
        deletions: 5,
        diff: "mock diff content",
      },
    ],
  }
}
