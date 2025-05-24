"use client"

import { useEffect, useState } from "react"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx"
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript"
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript"

// Register languages for syntax highlighting
SyntaxHighlighter.registerLanguage("tsx", tsx)
SyntaxHighlighter.registerLanguage("typescript", typescript)
SyntaxHighlighter.registerLanguage("javascript", javascript)

interface CodeDiffProps {
  diff: string
}

export function CodeDiff({ diff }: CodeDiffProps) {
  const [parsedDiff, setParsedDiff] = useState<{
    language: string
    lines: Array<{
      content: string
      type: "context" | "addition" | "deletion" | "header"
      lineNumber?: number
    }>
  }>({ language: "tsx", lines: [] })

  useEffect(() => {
    // Parse the diff in a useEffect to avoid suspending during render
    const parseDiff = (diffText: string) => {
      // Determine language from file extension
      const language = "tsx" // Default to TSX

      // Parse diff
      const lines = diffText.split("\n").map((line) => {
        // Headers (diff metadata)
        if (line.startsWith("@@")) {
          return { content: line, type: "header" as const }
        }
        // Additions
        else if (line.startsWith("+")) {
          return {
            content: line.substring(1),
            type: "addition" as const,
          }
        }
        // Deletions
        else if (line.startsWith("-")) {
          return {
            content: line.substring(1),
            type: "deletion" as const,
          }
        }
        // Context
        else {
          return {
            content: line.startsWith(" ") ? line.substring(1) : line,
            type: "context" as const,
          }
        }
      })

      return { language, lines }
    }

    setParsedDiff(parseDiff(diff))
  }, [diff])

  return (
    <div className="font-mono text-sm overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {parsedDiff.lines.map((line, index) => (
            <tr
              key={index}
              className={
                line.type === "addition"
                  ? "bg-green-50 dark:bg-green-950/30"
                  : line.type === "deletion"
                    ? "bg-red-50 dark:bg-red-950/30"
                    : line.type === "header"
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
              }
            >
              <td className="py-0.5 pl-4 pr-2 select-none text-gray-500 text-right border-r dark:border-gray-700">
                {line.type !== "header" && (
                  <span className="inline-block w-5">
                    {line.type === "addition" && "+"}
                    {line.type === "deletion" && "-"}
                  </span>
                )}
              </td>
              <td className="py-0.5 px-4 w-full">
                {line.type === "header" ? (
                  <span className="text-gray-500">{line.content}</span>
                ) : (
                  <SyntaxHighlighter
                    language={parsedDiff.language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      background: "transparent",
                    }}
                  >
                    {line.content}
                  </SyntaxHighlighter>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
