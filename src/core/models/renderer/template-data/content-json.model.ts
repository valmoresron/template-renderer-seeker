import { Attribute } from './attribute.model';

interface ContentJson {
  Location: {
    Attributes: Attribute[];
    Code: string;
    Latitude: number;
    Longitude: number;
    Name: string;
    TimeZoneId: string;
  };
  elements: {
    $$hashKey: string;
    description: string;
    group: string;
    label: string;
    maxLength: number;
    name: string;
    required: boolean;
    type: string;
    value: string;
  }[];
}

export type { ContentJson };
