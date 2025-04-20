"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Github, RefreshCw, Webhook } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  additions: number;
  deletions: number;
  commits: number;
  impactScore: number;
}

interface RepositoryAnalyzerPageProps {
  owner: string;
  repo: string;
  initialRepoDetails: any | null;
  initialContributors: any[];
}

export function RepositoryAnalyzerPage({
  owner,
  repo,
  initialRepoDetails,
  initialContributors,
}: RepositoryAnalyzerPageProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [repoDetails, setRepoDetails] = useState<any>(initialRepoDetails);
  const router = useRouter();

  useEffect(() => {
    console.log({ initialContributors, initialRepoDetails });

    if (initialContributors.length > 0) {
      analyzeContributors(initialContributors);
    } else {
      fetchContributors();
    }
  }, [owner, repo, initialContributors]);

  const fetchContributors = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch repository details if not provided
      if (!repoDetails) {
        const repoResponse = await fetch(`/api/github/repos/${owner}/${repo}`);
        if (!repoResponse.ok) {
          throw new Error("Failed to fetch repository details");
        }
        const repoData = await repoResponse.json();
        setRepoDetails(repoData);
      }

      // Fetch contributors
      const contributorsResponse = await fetch(
        `/api/github/repos/${owner}/${repo}/contributors`
      );
      if (!contributorsResponse.ok) {
        throw new Error("Failed to fetch contributors");
      }
      const contributorsData = await contributorsResponse.json();

      analyzeContributors(contributorsData);
    } catch (error) {
      console.error("Error analyzing repository:", error);
      setError("Failed to analyze repository. Please try again later.");
      setLoading(false);
    }
  };

  const analyzeContributors = async (contributorsData: any[]) => {
    try {
      // For each contributor, fetch additional stats
      const contributorsWithStats = await Promise.all(
        contributorsData.map(async (contributor: any) => {
          // Fetch commit stats for this contributor
          const commitsResponse = await fetch(
            `/api/github/repos/${owner}/${repo}/commits?author=${contributor.login}&per_page=100`
          );

          if (!commitsResponse.ok) {
            return {
              ...contributor,
              additions: 0,
              deletions: 0,
              commits: 0,
              impactScore: 0,
            };
          }

          const commitsData = await commitsResponse.json();

          // Calculate stats
          let totalAdditions = 0;
          let totalDeletions = 0;

          // In a real app, you would fetch detailed stats for each commit
          // For this demo, we'll use random values
          commitsData.forEach(() => {
            totalAdditions += Math.floor(Math.random() * 100);
            totalDeletions += Math.floor(Math.random() * 50);
          });

          // Calculate impact score (this is a simplified formula)
          // In a real app, you might use a more sophisticated algorithm
          const res = await fetch(`/api/score/${repo}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const impactScore = await res.json();

          return {
            login: contributor.login,
            avatar_url: contributor.avatar_url,
            contributions: contributor.contributions,
            additions: totalAdditions,
            deletions: totalDeletions,
            commits: commitsData.length,
            impactScore: impactScore.res.score,
          };
        })
      );

      // Sort by impact score
      const sortedContributors = contributorsWithStats.sort(
        (a: Contributor, b: Contributor) => b.impactScore - a.impactScore
      );

      setContributors(sortedContributors);
      setLoading(false);
    } catch (error) {
      console.error("Error analyzing contributors:", error);
      setError("Failed to analyze contributors. Please try again later.");
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const data = {
      repository: {
        name: repo,
        owner: owner,
        url: repoDetails?.html_url,
      },
      contributors: contributors.map((c) => ({
        username: c.login,
        contributions: c.contributions,
        additions: c.additions,
        deletions: c.deletions,
        commits: c.commits,
        impactScore: c.impactScore,
      })),
      analyzedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${owner}-${repo}-analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateWebhook = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/github/webhooks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner,
          repo,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create webhook");
      }
      const data = await response.json();
      console.log("Webhook created:", data);
      setLoading(false);
    } catch (error) {
      console.error("Error creating webhook:", error);
      setError("Failed to create webhook. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center">
          <Github className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">
            {owner}/{repo}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contributor Impact Analysis</CardTitle>
          <CardDescription>
            Analysis of contributor impact based on commits, additions, and
            deletions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2">Analyzing repository...</span>
            </div>
          ) : contributors.length === 0 ? (
            <div className="text-center py-4">No contributors found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contributor</TableHead>
                  <TableHead className="text-right">Commits</TableHead>
                  <TableHead className="text-right">Additions</TableHead>
                  <TableHead className="text-right">Deletions</TableHead>
                  <TableHead className="text-right">Impact Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributors.map((contributor) => (
                  <TableRow key={contributor.login}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <img
                          src={contributor.avatar_url || "/placeholder.svg"}
                          alt={contributor.login}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        {contributor.login}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {contributor.commits}
                    </TableCell>
                    <TableCell className="text-right text-green-500">
                      +{contributor.additions}
                    </TableCell>
                    <TableCell className="text-right text-red-500">
                      -{contributor.deletions}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {contributor.impactScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            onClick={() => {
              fetch(`/api/update-score`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  owner,
                  repo,
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log({ data });
                });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleExportJSON}
            disabled={loading || contributors.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export as JSON
          </Button>
          <Button onClick={handleCreateWebhook} disabled={loading}>
            <Webhook className="h-4 w-4 mr-2" />
            Create Webhook
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
