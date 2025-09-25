import { Layer } from './layer.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RectangleLayerResolutionProperties {}

interface RectangleLayerStaticProperties {
  backgroundColour: string;
  boxRadius: string;
  duration: number;
  fieldSettings: {
    editable: boolean;
    mandatory: boolean;
  };
  name: string;
  outlineColour: string;
  outlineWeight: number;
  start: number;
}

interface RectangleLayer extends Layer<RectangleLayerResolutionProperties> {
  properties: RectangleLayerStaticProperties;
}

export type {
  RectangleLayer,
  RectangleLayerResolutionProperties,
  RectangleLayerStaticProperties,
};
