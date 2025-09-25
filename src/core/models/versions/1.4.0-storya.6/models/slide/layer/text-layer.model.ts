import { Layer } from './layer.model';

interface TextContent {
  content: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textAlign: string;
  verticalAlign: string;
}

interface TextLayerResolutionProperties {
  fontSize: string;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
}

interface TextLayerStaticProperties {
  description?: string;
  duration: number;
  fieldSettings: {
    editable: boolean;
    mandatory: boolean;
  };
  fontColour: string;
  fontFamily: string;
  name: string;
  start: number;
  textContent: TextContent;
  maxCharacter?: string;
}

interface TextLayer extends Layer<TextLayerResolutionProperties> {
  properties: TextLayerStaticProperties;
}

export type {
  TextLayer,
  TextLayerResolutionProperties,
  TextContent,
  TextLayerStaticProperties,
};
