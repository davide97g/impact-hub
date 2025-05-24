import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { GitPullRequest, Check, AlertTriangle, FileCode, Github, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeDiff } from "@/components/code-diff"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

// MOCK: For preview, we'll create a mock user
const mockUser = {
  id: "mock-user-id",
  name: "Demo User",
  email: "user@example.com",
  image: "https://github.com/identicons/app/oauth_app/1234",
}

// MOCK: Mock data for an individual review
const mockReview = {
  id: "review_1",
  repository: "acme/website",
  repoUrl: "https://github.com/acme/website",
  prNumber: 123,
  prTitle: "Add new landing page components",
  prUrl: "https://github.com/acme/website/pull/123",
  author: "johndoe",
  authorUrl: "https://github.com/johndoe",
  createdAt: "2025-05-21T14:30:00Z",
  status: "completed",
  scores: {
    complexity: 8.2,
    readability: 7.5,
    cleanliness: 9.0,
    robustness: 6.8,
  },
  summary:
    "This PR adds several new components for the landing page redesign. The code is generally well-structured with good component separation. There are some minor improvements that could be made for readability and robustness.",
  recommendations: [
    "Consider adding more detailed type definitions for component props",
    "Add error boundaries around the dynamic content sections",
    "Improve variable naming in the animation utility functions",
    "Extract common styling patterns into shared utility classes",
  ],
  files: [
    {
      name: "components/HeroSection.tsx",
      additions: 124,
      deletions: 27,
      diff: `@@ -1,27 +1,124 @@
import { Button } from "@/components/ui/button";
-export function HeroSection() {
+export function HeroSection({ 
+  title, 
+  subtitle, 
+  ctaText 
+}: { 
+  title: string; 
+  subtitle: string; 
+  ctaText: string;
+}) {
  return (
-    <div className="container mx-auto py-12">
-      <h1 className="text-4xl font-bold">Welcome to Acme</h1>
-      <p className="mt-4">The best platform for your needs</p>
-      <Button className="mt-6">Get Started</Button>
+    <div className="container mx-auto py-24 relative overflow-hidden">
+      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950 dark:to-transparent z-0" />
+      
+      <div className="relative z-10 max-w-3xl mx-auto text-center">
+        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
+          {title || "Welcome to Acme"}
+        </h1>
+        <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
+          {subtitle || "The best platform for your needs"}
+        </p>
+        <Button size="lg" className="mt-8 px-8 py-6 text-lg">
+          {ctaText || "Get Started"}
+        </Button>
+        
+        <div className="mt-12 flex justify-center space-x-6">
+          <FeatureBadge icon="✨" text="Easy to use" />
+          <FeatureBadge icon="🚀" text="High performance" />
+          <FeatureBadge icon="🔒" text="Secure by default" />
+        </div>
+      </div>
    </div>
  );
}

+function FeatureBadge({ icon, text }: { icon: string; text: string }) {
+  return (
+    <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm">
+      <span className="text-lg mr-2">{icon}</span>
+      <span className="font-medium">{text}</span>
+    </div>
+  );
+}`,
    },
    {
      name: "components/FeatureGrid.tsx",
      additions: 87,
      deletions: 0,
      diff: `@@ -0,0 +1,87 @@
+import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
+
+interface Feature {
+  title: string;
+  description: string;
+  icon: string;
+}
+
+export function FeatureGrid({ 
+  features = defaultFeatures
+}: { 
+  features?: Feature[] 
+}) {
+  return (
+    <div className="container mx-auto py-16">
+      <div className="text-center mb-12">
+        <h2 className="text-3xl font-bold">Powerful Features</h2>
+        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
+          Everything you need to build amazing products, all in one platform
+        </p>
+      </div>
+      
+      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
+        {features.map((feature, index) => (
+          <FeatureCard
+            key={index}
+            title={feature.title}
+            description={feature.description}
+            icon={feature.icon}
+          />
+        ))}
+      </div>
+    </div>
+  );
+}
+
+function FeatureCard({ 
+  title, 
+  description, 
+  icon 
+}: Feature) {
+  return (
+    <Card>
+      <CardHeader>
+        <div className="text-3xl mb-4">{icon}</div>
+        <CardTitle>{title}</CardTitle>
+      </CardHeader>
+      <CardContent>
+        <CardDescription className="text-base">{description}</CardDescription>
+      </CardContent>
+    </Card>
+  );
+}
+
+const defaultFeatures: Feature[] = [
+  {
+    title: "Fast Performance",
+    description: "Optimized for speed with best-in-class loading times and interactions.",
+    icon: "⚡"
+  },
+  {
+    title: "Responsive Design",
+    description: "Looks great on any device, from mobile phones to desktop monitors.",
+    icon: "📱"
+  },
+  {
+    title: "Secure by Default",
+    description: "Built with security best practices to keep your data safe.",
+    icon: "🔒"
+  },
+  {
+    title: "Easy Customization",
+    description: "Simple to customize and extend for your specific requirements.",
+    icon: "🎨"
+  },
+  {
+    title: "Detailed Analytics",
+    description: "Gain insights with comprehensive analytics and reporting.",
+    icon: "📊"
+  },
+  {
+    title: "24/7 Support",
+    description: "Get help whenever you need it with our dedicated support team.",
+    icon: "🔧"
+  }
+];`,
    },
  ],
}

export default function ReviewDetailsPage({ params }: { params: { id: string } }) {
  // MOCK: For preview, we'll skip the real authentication check
  // In production, this would redirect unauthenticated users

  // MOCK: For preview, we'll use mock data instead of fetching from a database
  const review = mockReview

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={mockUser} />

      <main className="flex-1 container py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5 text-gray-500" />
                <h1 className="text-2xl font-bold">
                  {review.repository} #{review.prNumber}
                </h1>
                <ReviewStatusBadge status={review.status} />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{review.prTitle}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={review.prUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-1 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
              <Button size="sm">Refresh Analysis</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Suspense
            fallback={
              <div className="md:col-span-2 space-y-6">
                <LoadingSpinner />
              </div>
            }
          >
            <div className="md:col-span-2 space-y-6">
              <Suspense
                fallback={
                  <div className="py-8 text-center">
                    <LoadingSpinner />
                  </div>
                }
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                    <CardDescription>AI-generated overview of the code changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{review.summary}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>Suggestions to improve code quality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {review.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Tabs defaultValue="files">
                  <TabsList>
                    <TabsTrigger value="files">Files Changed</TabsTrigger>
                    <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
                  </TabsList>

                  <TabsContent value="files" className="space-y-6">
                    {review.files.map((file, fileIndex) => (
                      <Card key={fileIndex}>
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileCode className="h-4 w-4 mr-2 text-gray-500" />
                              <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-green-600">+{file.additions}</span>
                              <span className="mx-1">/</span>
                              <span className="text-red-600">-{file.deletions}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                          <CodeDiff diff={file.diff} />
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="feedback">
                    <Card>
                      <CardHeader>
                        <CardTitle>Detailed Feedback</CardTitle>
                        <CardDescription>In-depth analysis of each file and function</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-500 py-8 text-center">
                          Detailed feedback is available in the professional version.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </Suspense>
            </div>
          </Suspense>

          <div className="space-y-6">
            <ScoreCard scores={review.scores} />

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Repository</dt>
                    <dd className="mt-1">
                      <Link
                        href={review.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:underline"
                      >
                        <Github className="h-3.5 w-3.5 mr-1" />
                        {review.repository}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Pull Request</dt>
                    <dd className="mt-1">
                      <Link
                        href={review.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:underline"
                      >
                        <GitPullRequest className="h-3.5 w-3.5 mr-1" />#{review.prNumber}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Author</dt>
                    <dd className="mt-1">
                      <Link
                        href={review.authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        {review.author}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm">{new Date(review.createdAt).toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Files Changed</dt>
                    <dd className="mt-1 text-sm">{review.files.length}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function ReviewStatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <Check className="h-3 w-3 mr-1" />
        Completed
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
      <AlertTriangle className="h-3 w-3 mr-1" />
      In Progress
    </Badge>
  )
}

function ScoreCard({ scores }: { scores: Record<string, number> }) {
  const categories = [
    { key: "complexity", label: "Complexity", description: "How complex the code is to understand" },
    { key: "readability", label: "Readability", description: "How easy the code is to read and follow" },
    { key: "cleanliness", label: "Cleanliness", description: "Code style, formatting, and organization" },
    { key: "robustness", label: "Robustness", description: "Error handling and edge case coverage" },
  ]

  const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Code Quality Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <svg className="w-24 h-24">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="38"
                cx="48"
                cy="48"
              />
              <circle
                className={`${getScoreColor(overallScore)} transition-all duration-300 ease-in-out`}
                strokeWidth="8"
                strokeDasharray={`${overallScore * 23.9} 239`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="38"
                cx="48"
                cy="48"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{overallScore.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Overall Score</p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">{category.label}</div>
                <div className="text-sm font-medium">{scores[category.key].toFixed(1)}</div>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${getScoreColor(scores[category.key])}`}
                  style={{ width: `${scores[category.key] * 10}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getScoreColor(score: number) {
  if (score >= 8) return "text-green-500"
  if (score >= 6) return "text-yellow-500"
  if (score >= 4) return "text-orange-500"
  return "text-red-500"
}
