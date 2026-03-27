import { PageBuilder } from "@/components/cms/page-builder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Page Builder | CMS",
  description: "Visual page builder with drag-and-drop sections and live wireframe preview",
};

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="px-6 py-3 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Templates
            </Button>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Page Builder</h1>
              <p className="text-xs text-muted-foreground">
                Drag, drop, and preview your page layout
              </p>
            </div>
          </div>
        </div>
      </header>
      <PageBuilder />
    </div>
  );
}
