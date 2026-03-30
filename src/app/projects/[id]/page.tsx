"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Project } from "@/lib/project-types";
import { getProject, saveProject } from "@/lib/project-store";
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
