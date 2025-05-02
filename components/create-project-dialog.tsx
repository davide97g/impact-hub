"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { Label } from "@/components/ui/label";

export function CreateProjectDialog({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const userResponse = await fetch("api/github/user");

    const userData = await userResponse.json();

    const projectRes = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        userId: userData.login,
      }),
    });

    const projectData = await projectRes.json();
    console.log({ projectData });

    setIsLoading(false);
    setOpen(false);
    router.refresh();

    // router.push(`/projects/${projectData.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crea nuovo progetto</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli per il tuo nuovo progetto. Potrai collegare
              un repository GitHub successivamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome del progetto</Label>
              <Input
                id="name"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creazione in corso..." : "Crea progetto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
