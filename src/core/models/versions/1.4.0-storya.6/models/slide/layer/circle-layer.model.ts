import { Layer } from './layer.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CircleLayerResolutionProperties {} // Empty as of 1.4.0-storya.4

interface CircleLayerStaticProperties {
  backgroundColour: string;
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

interface CircleLayer extends Layer<CircleLayerResolutionProperties> {
  properties: CircleLayerStaticProperties;
}

export type {
  CircleLayer,
  CircleLayerResolutionProperties,
  CircleLayerStaticProperties,
};
