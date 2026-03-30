"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
    // Detect what changed for activity logging
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
    <ProjectDashboard
      project={project}
      onUpdate={handleUpdate}
      onNavigateToPage={(pageId) => {
        router.push(`/projects/${projectId}/pages/${pageId}`);
      }}
    />
  );
}
