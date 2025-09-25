import { SlideKeyframe } from './keyframe.model';
import { Layer } from './layer/layer.model';

type SlideBackgroundType = 'transparent' | 'image' | 'video' | 'solid';
type SlideBackgroundFit = 'cover' | 'contain' | 'auto';
type SlideBackgroundRepeat =
  | 'repeat'
  | 'repeat-x'
  | 'repeat-y'
  | 'no-repeat'
  | 'space'
  | 'round'
  | 'initial'
  | 'inherit';
type SlideBackgroundPosition =
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'center top'
  | 'center center'
  | 'center bottom';

interface SlideBackgroundMedia {
  name: string;
  url: string;
}

interface SlideProperties {
  backgroundColour: string;
  backgroundFit: SlideBackgroundFit;
  backgroundImage?: SlideBackgroundMedia;
  backgroundVideo?: SlideBackgroundMedia;
  backgroundType: SlideBackgroundType;
  duration: number;
  name?: string; // Sometimes this doesn't exist. Weird.
  backgroundRepeat: SlideBackgroundRepeat;
  backgroundPosition: SlideBackgroundPosition;
}

interface Slide {
  id: string;
  layers: Layer[];
  animations: { keyframes: SlideKeyframe[] };
  properties: SlideProperties;
}

export type {
  Slide,
  SlideBackgroundMedia,
  SlideBackgroundType,
  SlideBackgroundFit,
};
