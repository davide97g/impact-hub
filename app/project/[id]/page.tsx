import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Github, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectRepoDialog } from "@/components/connect-repo-dialog";
import { cookies } from "next/headers";
import { DashboardPage } from "@/components/dashboard-page";
import { RepositoryAnalyzerPage } from "@/components/repository-analyzer-page";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("github_session");

  // In a real app, you would fetch the project data based on the ID
  const resProject = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/project/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const project: {
    id: string;
    name: string;
    repo_name: string;
    user_id: string;
    owner: string;
  } = await resProject.json();

  console.log({ project, cond: !!project.repo_name });

  let contributors;
  let repoDetails;

  if (project.repo_name) {
    const repoRes = await fetch(
      `https://api.github.com/repos/${project.owner}/${project.repo_name}`,
      {
        headers: {
          Authorization: `token ${sessionCookie?.value}`,
        },
      }
    );

    if (repoRes.ok) {
      repoDetails = await repoRes.json();
    }

    const contribRes = await fetch(
      `https://api.github.com/repos/${project.owner}/${project.repo_name}/contributors`,
      {
        headers: {
          Authorization: `token ${sessionCookie?.value}`,
        },
      }
    );

    if (contribRes.ok) {
      contributors = await contribRes.json();
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Torna alla dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
      </div>

      {!project.repo_name || !contributors || !repoDetails ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                Collega un repository GitHub
              </CardTitle>
              <CardDescription className="text-center">
                Collega un repository GitHub per sbloccare tutte le funzionalità
                del progetto
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ConnectRepoDialog sessionCookie={sessionCookie} projectId={id}>
                <Button>
                  <Github className="mr-2 h-4 w-4" />
                  Collega Repository
                </Button>
              </ConnectRepoDialog>
            </CardContent>
          </Card>
        </div>
      ) : (
        <RepositoryAnalyzerPage
          owner={project.user_id}
          repo={project.repo_name}
          initialRepoDetails={repoDetails}
          initialContributors={contributors}
        />
      )}
    </div>
  );
}
