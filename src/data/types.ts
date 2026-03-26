import { WireframeBlockId } from "./wireframe-types";

export type FrequencyTier = "high" | "medium" | "low";

export interface ComponentOption {
  /** Display name using shadcn block naming */
  name: string;
  /** Which wireframe to render */
  wireframeId: WireframeBlockId;
}

export interface ContentTheme {
  id: string;
  name: string;
  frequencyTier: FrequencyTier;
  componentOptions: ComponentOption[];
  considerations: string[];
  clientDiscoveryQuestions: string[];
  informationAndAssets: string[];
  industryNotes: string[];
}

export interface PageTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  contentThemes: ContentTheme[];
  contentArchitecture?: string[];
  generalNotes?: string[];
}
