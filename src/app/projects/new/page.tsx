"use client";

import { useRouter } from "next/navigation";
import { ProjectWizard } from "@/components/cms/project-wizard";

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <ProjectWizard
      onComplete={(projectId) => {
        router.push(`/projects/${projectId}`);
      }}
    />
  );
}
