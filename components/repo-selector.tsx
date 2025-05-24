"use client"

import { useState } from "react"
import { Check, Github } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  private: boolean
  html_url: string
}

interface RepoSelectorProps {
  repositories: Repository[]
  enabledRepos: number[]
}

export function RepoSelector({ repositories, enabledRepos }: RepoSelectorProps) {
  const [enabled, setEnabled] = useState<number[]>(enabledRepos)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({})

  const toggleRepo = async (repoId: number) => {
    try {
      const isCurrentlyEnabled = enabled.includes(repoId)

      // Optimistic UI update
      if (isCurrentlyEnabled) {
        setEnabled(enabled.filter((id) => id !== repoId))
      } else {
        setEnabled([...enabled, repoId])
      }

      // Set loading state for this specific repo
      setIsLoading((prev) => ({ ...prev, [repoId]: true }))

      // Send request to API
      const response = await fetch("/api/repositories/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoId,
          enabled: !isCurrentlyEnabled,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update repository settings")
      }

      toast({
        title: "Repository updated",
        description: `Code reviews are now ${isCurrentlyEnabled ? "disabled" : "enabled"} for this repository.`,
      })
    } catch (error) {
      console.error("Error toggling repository:", error)

      // Revert the UI state on error
      if (enabled.includes(repoId)) {
        setEnabled(enabled.filter((id) => id !== repoId))
      } else {
        setEnabled([...enabled, repoId])
      }

      toast({
        title: "Error",
        description: "Failed to update repository settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Clear loading state
      setIsLoading((prev) => ({ ...prev, [repoId]: false }))
    }
  }

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          className="pl-8"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Github className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      </div>

      <div className="divide-y">
        {filteredRepos.length === 0 ? (
          <p className="py-4 text-center text-gray-500">No repositories found matching your search</p>
        ) : (
          filteredRepos.map((repo) => (
            <div key={repo.id} className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="font-medium truncate">{repo.full_name}</span>
                </div>
                {repo.description && <p className="text-sm text-gray-500 mt-1 truncate">{repo.description}</p>}
              </div>

              <div className="flex items-center ml-4">
                {isLoading[repo.id] ? (
                  <LoadingSpinner className="mr-2" />
                ) : (
                  <>
                    <Switch
                      checked={enabled.includes(repo.id)}
                      onCheckedChange={() => toggleRepo(repo.id)}
                      className="ml-2"
                    />
                    {enabled.includes(repo.id) && <Check className="h-4 w-4 ml-2 text-green-500" />}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
