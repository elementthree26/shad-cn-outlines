"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/project-types";
import { getProject, saveProject } from "@/lib/project-store";
import { logActivity } from "@/lib/activity-log";
import { ProjectDashboard } from "@/components/cms/project-dashboard";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = getProject(projectId);
    if (!p) {
      router.push("/projects");
      return;
    }
    setProject(p);
  }, [projectId, router]);

  if (!project) return null;

  const handleUpdate = (updated: Project) => {
    if (project) {
      if (updated.sitemap.length !== project.sitemap.length) {
        const diff = updated.sitemap.length - project.sitemap.length;
        logActivity(projectId, diff > 0 ? "Added page" : "Removed page", `Sitemap now has ${updated.sitemap.length} pages`, "page");
      }
      if (updated.phases !== project.phases) {
        const approvedCount = updated.phases.filter((p) => p.gateApproved).length;
        const oldApproved = project.phases?.filter((p) => p.gateApproved).length || 0;
        if (approvedCount > oldApproved) {
          logActivity(projectId, "Gate approved", `${approvedCount}/7 phases approved`, "phase");
        }
      }
      if (updated.redirects?.length !== project.redirects?.length) {
        logActivity(projectId, "Redirects updated", `${updated.redirects?.length || 0} redirects`, "redirect");
      }
      if (JSON.stringify(updated.styleGuide) !== JSON.stringify(project.styleGuide)) {
        logActivity(projectId, "Style guide updated", "", "style");
      }
    }
    const saved = saveProject(updated);
    setProject(saved);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Projects
            </Button>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt="" className="h-7 w-7 rounded object-contain" />
            ) : (
              <div className="rounded-lg bg-primary p-1.5">
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-sm font-bold leading-tight">
                {project.clientName || "Untitled Project"}
              </h1>
              <p className="text-[10px] text-muted-foreground">
                {project.industry || "No industry"} • {project.sitemap.length} pages
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        <ProjectDashboard
          project={project}
          onUpdate={handleUpdate}
          onNavigateToPage={(pageId) => {
            router.push(`/projects/${projectId}/pages/${pageId}`);
          }}
        />
      </main>
    </div>
  );
}
