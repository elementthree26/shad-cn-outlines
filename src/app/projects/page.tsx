"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, FolderOpen, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/project-types";
import { getAllProjects, deleteProject } from "@/lib/project-store";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getAllProjects());
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    deleteProject(id);
    setProjects(getAllProjects());
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <div className="h-5 w-px bg-border" />
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-primary p-2">
                  <FolderOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Projects</h1>
                  <p className="text-xs text-muted-foreground">
                    Website build workspaces
                  </p>
                </div>
              </div>
            </div>
            <Link href="/projects/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
            <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first project to start building a website from scratch
              with style guides, sitemaps, and page layouts.
            </p>
            <Link href="/projects/new">
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" />
                Create First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const pagesBuilt = project.sitemap.filter(
                (p) => p.sections.length > 0
              ).length;
              return (
                <Card key={project.id} className="group relative">
                  <Link href={`/projects/${project.id}`}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        {project.logoUrl ? (
                          <img
                            src={project.logoUrl}
                            alt=""
                            className="h-10 w-10 rounded object-contain"
                          />
                        ) : (
                          <div className="rounded-lg bg-primary/10 p-2.5">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base">
                            {project.clientName || "Untitled Project"}
                          </CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {project.industry || "No industry set"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {project.sitemap.length} pages
                        </Badge>
                        {pagesBuilt > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-green-300 text-green-700"
                          >
                            {pagesBuilt} built
                          </Badge>
                        )}
                        {project.cmsPlatform && project.cmsPlatform !== "TBD" && (
                          <Badge variant="outline" className="text-xs">
                            {project.cmsPlatform}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-3">
                        Updated{" "}
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(project.id);
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
