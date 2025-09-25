/* eslint-disable @typescript-eslint/naming-convention */

export type PlaceholderType = 'Text' | 'Image' | 'Video' | 'Audio';

export interface Placeholder {
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
}

export interface TemplateJSon {
  Name: string;
  Placeholders: Placeholder[];
}
