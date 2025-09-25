import { PlaceholderType } from './template-json.model';

export interface DataJsonSlidePlaceholder {
  id: string;
  order: number;
  type: PlaceholderType;
  reference: string;
  limit: number;
  value: string;
  localPathValue: string;
}

export interface DataJsonSlide {
  id: string;
  order: number;
  placeholders: DataJsonSlidePlaceholder[];
}

export interface DataJson {
  slides: DataJsonSlide[];
}
