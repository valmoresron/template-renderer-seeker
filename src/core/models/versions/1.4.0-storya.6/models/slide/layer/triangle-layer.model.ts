import { Layer } from './layer.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TriangleLayerResolutionProperties {}

interface TriangleLayerStaticProperties {
  backgroundColour: string;
  duration: number;
  fieldSettings: {
    editable: boolean;
    mandatory: boolean;
  };
  name: string;
  start: number;
}

interface TriangleLayer extends Layer<TriangleLayerResolutionProperties> {
  properties: TriangleLayerStaticProperties;
}

export type {
  TriangleLayer,
  TriangleLayerResolutionProperties,
  TriangleLayerStaticProperties,
};
