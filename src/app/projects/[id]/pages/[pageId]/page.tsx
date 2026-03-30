"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project, SitemapPage, PageSection } from "@/lib/project-types";
import { getProject, saveProject } from "@/lib/project-store";
import { ProjectPageBuilder } from "@/components/cms/project-page-builder";
import { ExportPanel } from "@/components/cms/page-export";

export default function ProjectPageBuilderRoute() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const pageId = params.pageId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState<SitemapPage | null>(null);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const p = getProject(projectId);
    if (!p) { router.push("/projects"); return; }
    const page = p.sitemap.find((pg) => pg.id === pageId);
    if (!page) { router.push(`/projects/${projectId}`); return; }
    setProject(p);
    setCurrentPage(page);
  }, [projectId, pageId, router]);

  const handleSave = useCallback(
    (sections: PageSection[]) => {
      if (!project || !currentPage) return;
      const updatedSitemap = project.sitemap.map((pg) =>
        pg.id === currentPage.id ? { ...pg, sections } : pg
      );
      const updated = saveProject({ ...project, sitemap: updatedSitemap });
      setProject(updated);
      setCurrentPage(updated.sitemap.find((pg) => pg.id === pageId) || null);
    },
    [project, currentPage, pageId]
  );

  if (!project || !currentPage) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="px-6 py-3 flex items-center gap-4">
          <Link href={`/projects/${projectId}`}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              {project.clientName || "Project"}
            </Button>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">
                {currentPage.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                /{currentPage.slug}
                {currentPage.purpose && ` — ${currentPage.purpose}`}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {currentPage.notes && (
              <Badge variant="secondary" className="text-xs hidden sm:flex">
                Has notes
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => setShowExport(true)}
              disabled={currentPage.sections.length === 0}
            >
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </header>
      <ProjectPageBuilder
        project={project}
        page={currentPage}
        onSave={handleSave}
      />
      {showExport && (
        <ExportPanel
          project={project}
          page={currentPage}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
