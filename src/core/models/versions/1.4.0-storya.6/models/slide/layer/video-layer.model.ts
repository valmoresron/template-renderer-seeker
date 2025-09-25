import { Layer } from './layer.model';

type VideoFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

interface VideoLayerResolutionProperties {
  videoFit: VideoFit;
}

interface VideoLayerStaticProperties {
  assetCategory?: string[];
  description?: string;
  duration: number;
  fieldSettings: {
    editable: boolean;
    mandatory: boolean;
  };
  name: string;
  start: number;
  video: {
    name: string;
    url: string;
  };
}

interface VideoLayer extends Layer<VideoLayerResolutionProperties> {
  properties: VideoLayerStaticProperties;
}

export type { VideoLayer, VideoLayerResolutionProperties, VideoFit };
