import type { MetadataRoute } from "next";

import { getPublishedPosts, getPublishedProjects, getPublishedResearch } from "@/src/lib/queries/portfolio";

const siteUrl = "https://aman-portfolio-aman1684.vercel.app";
const publicRoutes = [
  "/",
  "/about",
  "/projects",
  "/experience",
  "/skills",
  "/research",
  "/blog",
  "/contact",
];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [projects, research, posts] = await Promise.all([
    getPublishedProjects().catch(() => []),
    getPublishedResearch().catch(() => []),
    getPublishedPosts().catch(() => []),
  ]);

  return [
    ...publicRoutes.map((route) => ({
      url: new URL(route, siteUrl).toString(),
      lastModified: now,
      changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
      priority: route === "/" ? 1 : 0.7,
    })),
    ...projects.map((project) => ({
      url: new URL(`/projects/${encodeURIComponent(project.slug)}`, siteUrl).toString(),
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...research.map((item) => ({
      url: new URL(`/research/${encodeURIComponent(item.slug)}`, siteUrl).toString(),
      lastModified: new Date(item.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: new URL(`/blog/${encodeURIComponent(post.slug)}`, siteUrl).toString(),
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
