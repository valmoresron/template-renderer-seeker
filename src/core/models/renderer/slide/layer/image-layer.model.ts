import { Layer } from './layer.model';

type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

interface ImageLayerResolutionProperties {
  imageFit: ImageFit;
}

interface ImageLayerStaticProperties {
  assetCategory?: string[];
  description?: string;
  duration: number;
  fieldSettings: {
    editable: boolean;
    mandatory: boolean;
  };
  image: {
    name: string;
    url: string;
  };
  name: string;
}

interface ImageLayer extends Layer<ImageLayerResolutionProperties> {
  properties: ImageLayerStaticProperties;
}

export type {
  ImageLayer,
  ImageLayerResolutionProperties,
  ImageLayerStaticProperties,
  ImageFit,
};
