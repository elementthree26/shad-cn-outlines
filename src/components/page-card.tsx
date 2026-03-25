"use client";

import Link from "next/link";
import {
  Building2,
  Briefcase,
  MapPin,
  Home,
  Mail,
  Layers,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTemplate } from "@/data/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Briefcase,
  MapPin,
  Home,
  Mail,
  Layers,
  FileText,
};

export function PageCard({ page }: { page: PageTemplate }) {
  const Icon = iconMap[page.icon] || FileText;
  const highCount = page.contentThemes.filter(
    (t) => t.frequencyTier === "high"
  ).length;
  const medCount = page.contentThemes.filter(
    (t) => t.frequencyTier === "medium"
  ).length;
  const lowCount = page.contentThemes.filter(
    (t) => t.frequencyTier === "low"
  ).length;

  return (
    <Link href={`/pages/${page.slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">{page.name}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {page.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="text-xs">
              {page.contentThemes.length} content themes
            </Badge>
            {highCount > 0 && (
              <Badge
                variant="outline"
                className="text-xs border-green-300 text-green-700"
              >
                {highCount} high priority
              </Badge>
            )}
            {medCount > 0 && (
              <Badge
                variant="outline"
                className="text-xs border-yellow-300 text-yellow-700"
              >
                {medCount} medium
              </Badge>
            )}
            {lowCount > 0 && (
              <Badge
                variant="outline"
                className="text-xs border-gray-300 text-gray-500"
              >
                {lowCount} low
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
