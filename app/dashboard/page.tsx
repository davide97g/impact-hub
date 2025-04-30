import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("github_session");

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${sessionCookie?.value}`,
    },
  });

  const userData = await userResponse.json();

  const projectsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/${userData.login}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const projects: {
    id: string;
    name: string;
    repo_name: string;
    user_id: string;
  }[] = await projectsResponse.json();

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progetti</h1>
          <p className="text-muted-foreground mt-1">
            Gestisci i tuoi progetti e le integrazioni GitHub
          </p>
        </div>
        <CreateProjectDialog sessionCookie={sessionCookie}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuovo Progetto
          </Button>
        </CreateProjectDialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Aggiornato</div>
              {!project.repo_name && (
                <div className="mt-2 text-sm text-amber-600 dark:text-amber-500">
                  Repository GitHub non collegato
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50 p-3">
              <Link href={`/project/${project.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Visualizza Progetto
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
