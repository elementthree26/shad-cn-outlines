import { allPages } from "@/data/pages";
import { PageCard } from "@/components/page-card";
import { FileText, PenTool, FolderOpen } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2.5">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Page Template Portal
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Content guidance, recommended modules, and discovery questions
                for typical website pages
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/projects">
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  <FolderOpen className="h-4 w-4" />
                  Projects
                </button>
              </Link>
              <Link href="/builder">
                <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                  <PenTool className="h-4 w-4" />
                  Quick Builder
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allPages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>

        <div className="mt-12 rounded-lg border bg-muted/30 p-6">
          <h2 className="text-lg font-semibold mb-3">How to use this portal</h2>
          <div className="grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">
                1. Choose a page type
              </p>
              <p>
                Click into any page template to see the recommended content
                themes, modules, and guidance for that page type.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                2. Explore content themes
              </p>
              <p>
                Expand each theme to see considerations, client discovery
                questions, required assets, and industry-specific notes.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                3. Reorder modules
              </p>
              <p>
                Drag and drop content themes to customize the recommended page
                flow for a specific project.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
