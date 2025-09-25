import { LayerResolutions } from './layer-resolutions.model';
import { LayerType } from './layer-type.model';

interface Layer<Properties = unknown> {
  id: string;
  name: string;
  type: LayerType;
  resolutions: LayerResolutions<Properties>;
}

export type { Layer };
