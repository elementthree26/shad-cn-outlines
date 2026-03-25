import { PageTemplate } from "../types";
import { aboutPage } from "./about";
import { careersPage } from "./careers";
import { contactPage } from "./contact";
import { homePage } from "./home";
import { locationsPage } from "./locations";
import { servicesPage } from "./services";

export const allPages: PageTemplate[] = [
  homePage,
  aboutPage,
  servicesPage,
  careersPage,
  locationsPage,
  contactPage,
];

export function getPageBySlug(slug: string): PageTemplate | undefined {
  return allPages.find((p) => p.slug === slug);
}
