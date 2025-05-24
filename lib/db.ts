// MOCK: This is a mock database implementation for preview
// In a real application, replace with actual database integration like Prisma, Supabase, etc.

interface User {
  id: string
  email: string
  name?: string
  image?: string
  createdAt: Date
}

interface Repository {
  id: number
  userId: string
  repoId: number
  name: string
  fullName: string
  enabled: boolean
  webhookId?: string
  createdAt: Date
  updatedAt: Date
}

interface Review {
  id: string
  userId: string
  repoId: number
  prNumber: number
  prTitle: string
  status: "pending" | "in_progress" | "completed" | "failed"
  complexity?: number
  readability?: number
  cleanliness?: number
  robustness?: number
  summary?: string
  recommendations?: string[]
  createdAt: Date
  updatedAt: Date
}

// MOCK: In-memory storage for preview
const users: User[] = [
  {
    id: "mock-user-id",
    email: "user@example.com",
    name: "Demo User",
    image: "https://github.com/identicons/app/oauth_app/1234",
    createdAt: new Date(),
  },
]

const repositories: Repository[] = [
  {
    id: 1,
    userId: "mock-user-id",
    repoId: 1,
    name: "website",
    fullName: "acme/website",
    enabled: true,
    webhookId: "mock-webhook-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    userId: "mock-user-id",
    repoId: 3,
    name: "mobile-app",
    fullName: "acme/mobile-app",
    enabled: true,
    webhookId: "mock-webhook-3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    userId: "mock-user-id",
    repoId: 5,
    name: "design-system",
    fullName: "acme/design-system",
    enabled: true,
    webhookId: "mock-webhook-5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const reviews: Review[] = [
  {
    id: "review_1",
    userId: "mock-user-id",
    repoId: 1,
    prNumber: 123,
    prTitle: "Add new landing page components",
    status: "completed",
    complexity: 8.2,
    readability: 7.5,
    cleanliness: 9.0,
    robustness: 6.8,
    summary: "This PR adds several new components for the landing page redesign.",
    recommendations: ["Add more comprehensive error handling", "Improve type definitions"],
    createdAt: new Date("2025-05-21T14:30:00Z"),
    updatedAt: new Date("2025-05-21T14:35:00Z"),
  },
  {
    id: "review_2",
    userId: "mock-user-id",
    repoId: 3,
    prNumber: 87,
    prTitle: "Refactor authentication middleware",
    status: "completed",
    complexity: 6.4,
    readability: 8.2,
    cleanliness: 7.9,
    robustness: 8.5,
    summary: "This PR refactors the authentication middleware for better performance.",
    recommendations: ["Add unit tests for edge cases", "Document the authentication flow"],
    createdAt: new Date("2025-05-20T10:15:00Z"),
    updatedAt: new Date("2025-05-20T10:20:00Z"),
  },
  {
    id: "review_3",
    userId: "mock-user-id",
    repoId: 5,
    prNumber: 45,
    prTitle: "Fix navigation issues in settings screen",
    status: "in_progress",
    createdAt: new Date("2025-05-22T09:45:00Z"),
    updatedAt: new Date("2025-05-22T09:45:00Z"),
  },
]

// MOCK: Database operations for preview
export const db = {
  // User operations
  user: {
    create: async (data: Omit<User, "createdAt">) => {
      const newUser = { ...data, createdAt: new Date() }
      users.push(newUser)
      return newUser
    },
    findUnique: async (where: { id: string } | { email: string }) => {
      if ("id" in where) {
        return users.find((user) => user.id === where.id) || null
      } else {
        return users.find((user) => user.email === where.email) || null
      }
    },
    update: async (where: { id: string }, data: Partial<User>) => {
      const index = users.findIndex((user) => user.id === where.id)
      if (index !== -1) {
        users[index] = { ...users[index], ...data }
        return users[index]
      }
      return null
    },
  },

  // Repository operations
  repository: {
    create: async (data: Omit<Repository, "createdAt" | "updatedAt">) => {
      const newRepo = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      repositories.push(newRepo)
      return newRepo
    },
    findMany: async (where?: { userId: string }) => {
      if (where) {
        return repositories.filter((repo) => repo.userId === where.userId)
      }
      return repositories
    },
    findUnique: async (where: { id: number } | { repoId: number; userId?: string } | { repoId: number }) => {
      if ("id" in where) {
        return repositories.find((repo) => repo.id === where.id) || null
      } else if ("userId" in where && where.userId) {
        return repositories.find((repo) => repo.repoId === where.repoId && repo.userId === where.userId) || null
      } else {
        return repositories.find((repo) => repo.repoId === where.repoId) || null
      }
    },
    update: async (where: { id: number }, data: Partial<Repository>) => {
      const index = repositories.findIndex((repo) => repo.id === where.id)
      if (index !== -1) {
        repositories[index] = {
          ...repositories[index],
          ...data,
          updatedAt: new Date(),
        }
        return repositories[index]
      }
      return null
    },
    delete: async (where: { id: number }) => {
      const index = repositories.findIndex((repo) => repo.id === where.id)
      if (index !== -1) {
        const deleted = repositories[index]
        repositories.splice(index, 1)
        return deleted
      }
      return null
    },
  },

  // Review operations
  review: {
    create: async (data: Omit<Review, "createdAt" | "updatedAt">) => {
      const newReview = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      reviews.push(newReview)
      return newReview
    },
    findMany: async (where?: { userId: string } | { repoId: number }) => {
      if (where) {
        if ("userId" in where) {
          return reviews.filter((review) => review.userId === where.userId)
        } else {
          return reviews.filter((review) => review.repoId === where.repoId)
        }
      }
      return reviews
    },
    findUnique: async (where: { id: string }) => {
      return reviews.find((review) => review.id === where.id) || null
    },
    update: async (where: { id: string }, data: Partial<Review>) => {
      const index = reviews.findIndex((review) => review.id === where.id)
      if (index !== -1) {
        reviews[index] = {
          ...reviews[index],
          ...data,
          updatedAt: new Date(),
        }
        return reviews[index]
      }
      return null
    },
  },
}
