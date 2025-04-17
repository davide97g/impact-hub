"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Github, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface User {
  login: string;
  avatar_url: string;
}

interface DashboardPageProps {
  initialUser: User;
  initialRepositories: Repository[];
}

export function DashboardPage({
  initialUser,
  initialRepositories,
}: DashboardPageProps) {
  const [repositories, setRepositories] =
    useState<Repository[]>(initialRepositories);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use our server-side API proxy
      const response = await fetch(
        `/api/github/search/repositories?q=${searchTerm}`
      );

      if (!response.ok) {
        throw new Error("Failed to search repositories");
      }

      const data = await response.json();
      setRepositories(data.items);
      setLoading(false);
    } catch (error) {
      console.error("Error searching repositories:", error);
      setError("Failed to search repositories. Please try again later.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    router.push("/api/auth/logout");
  };

  const handleAnalyzeRepository = (owner: string, repo: string) => {
    router.push(`/analyze/${owner}/${repo}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Github className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">GitHub Repository Analyzer</h1>
        </div>
        {initialUser && (
          <div className="flex items-center">
            <img
              src={initialUser.avatar_url || "/placeholder.svg"}
              alt={initialUser.login}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="mr-4">{initialUser.login}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Repositories</CardTitle>
          <CardDescription>
            Search for public GitHub repositories to analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Repositories</CardTitle>
          <CardDescription>
            Select a repository to analyze contributor impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading repositories...</div>
          ) : repositories.length === 0 ? (
            <div className="text-center py-4">No repositories found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repositories.map((repo) => (
                  <TableRow key={repo.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {repo.name}
                      </Link>
                    </TableCell>
                    <TableCell>{repo.owner.login}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {repo.description || "No description"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAnalyzeRepository(repo.owner.login, repo.name)
                        }
                      >
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
