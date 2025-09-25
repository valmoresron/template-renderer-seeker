/* eslint-disable @typescript-eslint/naming-convention */

type PlaceholderType = 'Text' | 'Image' | 'Video' | 'Audio';

interface Placeholder {
  Type: PlaceholderType;
  Title: string;
  Reference: string;
  IsMandatory: boolean;
  IsEditable: boolean;
  Order: number;
  FieldPlaceholder: string;
  Description: string;
  Limit: number;
  Options: string;
  AssetCategories: string[];
  Slide: number;
  DefaultValue: string | null;
}

interface TemplateJson {
  Name: string;
  Placeholders: Placeholder[];
}

export type { PlaceholderType, Placeholder, TemplateJson };
