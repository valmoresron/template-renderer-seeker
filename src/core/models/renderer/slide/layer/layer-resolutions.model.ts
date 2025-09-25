import { Keyframe } from '../keyframe.model';

interface LayerResolutions<LayerProperties> {
  [key: string /* -- ex. 1920x1080 -- */]: {
    hidden: boolean;
    animate: boolean;
    properties: LayerProperties;
    keyframes: Keyframe[];
    timeframes: number[];
  };
}

export type { LayerResolutions };
