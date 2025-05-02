"use client";

import type React from "react";

import { Github, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function ConnectRepoDialog({
  children,
  projectId,
}: Readonly<{
  children: React.ReactNode;
  projectId: string;
}>) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [repositories, setRepositories] = useState<any[]>([]);

  const fetchRepositories = async () => {
    const reposResponse = await fetch(
      "/api/github/user/repos?sort=updated&per_page=10"
    );

    const repositories = await reposResponse.json();
    console.log({ repositories });

    setRepositories(repositories);
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const filteredRepos = searchQuery
    ? repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : repositories;

  const handleConnect = async (repoId: string, owner: string) => {
    setIsLoading(true);

    // Simulate connecting to repository
    await fetch("/api/project/repo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo_name: repoId,
        id: projectId,
        owner,
      }),
    });

    setIsLoading(false);
    setOpen(false);

    // Refresh the page to show the connected repo
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Collega un repository GitHub</DialogTitle>
          <DialogDescription>
            Seleziona un repository GitHub da collegare al tuo progetto
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca repository..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleConnect(repo.name, repo.owner.login)}
                >
                  <div className="flex items-start">
                    <Github className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{repo.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {repo.description}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" disabled={isLoading}>
                    Collega
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nessun repository trovato
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annulla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
