"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Project } from "@/lib/project-types";
import { getProject } from "@/lib/project-store";
import { AssessmentDeck } from "@/components/cms/assessment-deck";

export default function DeckPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = getProject(projectId);
    if (!p) { router.push("/projects"); return; }
    setProject(p);
  }, [projectId, router]);

  if (!project) return null;

  return <AssessmentDeck project={project} />;
}
