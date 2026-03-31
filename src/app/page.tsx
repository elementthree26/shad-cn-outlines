import Link from "next/link";
import {
  FolderOpen,
  PenTool,
  FileText,
  Layers,
  Paintbrush,
  ArrowRight,
  Sparkles,
  Download,
  Workflow,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="rounded-lg bg-primary p-2.5">
              <Layers className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              E3 Web Platform
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-lg">
            Build websites from scratch — discovery, sitemap, wireframes,
            content, style guide, code export. All 7 phases in one place.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Primary actions */}
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          <Link href="/projects" className="group">
            <div className="rounded-xl border-2 border-primary/20 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-primary p-2.5">
                  <FolderOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Projects</h2>
                  <p className="text-xs text-muted-foreground">Full website builds</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create a project with client info, discovery notes, sitemap,
                style guide, and wireframes for every page. Track all 7 phases
                from assessment to launch.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {["Discovery Wizard", "Visual Sitemap", "AI Suggestions", "Style Guide", "Page Builder", "Phase Tracker", "Exports"].map((f) => (
                  <span key={f} className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          <Link href="/builder" className="group">
            <div className="rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-muted p-2.5">
                  <PenTool className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Quick Builder</h2>
                  <p className="text-xs text-muted-foreground">Standalone page builder</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jump straight into the drag-and-drop page builder without
                creating a project. Great for quick wireframes, presentations,
                or experimenting with layouts.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {["Drag & Drop", "53 Blocks", "Style Guide", "Content", "Code Export"].map((f) => (
                  <span key={f} className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>

        {/* Reference section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-bold">Page Type Reference Library</h2>
            <span className="text-xs text-muted-foreground">— content themes, modules, and discovery questions per page type</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Homepage", slug: "home", icon: "🏠" },
              { name: "About / Why Us", slug: "about", icon: "🏢" },
              { name: "Services", slug: "services", icon: "⚙️" },
              { name: "Careers", slug: "careers", icon: "💼" },
              { name: "Locations", slug: "locations", icon: "📍" },
              { name: "Contact", slug: "contact", icon: "✉️" },
            ].map((page) => (
              <Link
                key={page.slug}
                href={`/pages/${page.slug}`}
                className="rounded-lg border bg-card p-3 text-center hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <span className="text-lg">{page.icon}</span>
                <p className="text-xs font-medium mt-1">{page.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Process overview */}
        <div className="rounded-lg border bg-muted/20 p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Workflow className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-bold">E3 7-Phase Web Process</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-7 text-center">
            {[
              { name: "Assessment", time: "2-4 wk", icon: "🔍" },
              { name: "IA", time: "1-2 wk", icon: "🗺️" },
              { name: "Messaging & UI", time: "2-4 wk", icon: "🎨" },
              { name: "Development", time: "1-2 wk", icon: "⚡" },
              { name: "QA & SEO", time: "1-2 wk", icon: "✅" },
              { name: "Launch", time: "1 day", icon: "🚀" },
              { name: "Optimize", time: "Ongoing", icon: "📈" },
            ].map((phase) => (
              <div key={phase.name} className="rounded-lg border bg-card p-3">
                <span className="text-lg">{phase.icon}</span>
                <p className="text-xs font-medium mt-1">{phase.name}</p>
                <p className="text-[10px] text-muted-foreground">{phase.time}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Human-led strategy. AI-powered execution. Continuous optimization.
            <span className="font-medium"> ~70% faster</span> than traditional (8-14 weeks vs 34-50 weeks).
          </p>
        </div>
      </main>
    </div>
  );
}
