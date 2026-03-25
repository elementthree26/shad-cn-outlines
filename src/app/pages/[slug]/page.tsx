import { notFound } from "next/navigation";
import { allPages, getPageBySlug } from "@/data/pages";
import { PageDetailClient } from "./page-detail-client";

export function generateStaticParams() {
  return allPages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // We need to await params per Next.js 15 async params
  // But generateMetadata can be async
  return params.then(({ slug }) => {
    const page = getPageBySlug(slug);
    if (!page) return { title: "Not Found" };
    return {
      title: `${page.name} - Page Template Portal`,
      description: page.description,
    };
  });
}

export default async function PageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <PageDetailClient page={page} />;
}
