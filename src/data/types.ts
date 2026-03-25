export type FrequencyTier = "high" | "medium" | "low";

export interface ContentTheme {
  id: string;
  name: string;
  frequencyTier: FrequencyTier;
  componentOptions: string[];
  considerations: string[];
  clientDiscoveryQuestions: string[];
  informationAndAssets: string[];
  industryNotes: string[];
  /** Optional screenshot/preview image paths for recommended modules */
  modulePreviewImages?: string[];
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
