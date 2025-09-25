import { Layer } from './layer.model';

interface TextLayerResolutionProperties {
  fontSize: string;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
}

interface TextLayerStaticProperties {
  description?: string;
  fieldSettings: {
    editable: boolean;
    mandatory: boolean;
  };
  fontColour: string;
  fontFamily: string;
  name: string;
  textContent: string;
  maxCharacter?: string;
}

interface TextLayer extends Layer<TextLayerResolutionProperties> {
  properties: TextLayerStaticProperties;
}

export type {
  TextLayer,
  TextLayerResolutionProperties,
  TextLayerStaticProperties,
};
