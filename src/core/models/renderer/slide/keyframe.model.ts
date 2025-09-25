interface Keyframe<T = number | string> {
  property: string;
  values: T[];
}

interface SlideKeyframe {
  property: string;
  from: string;
  to: string;
}

export type { Keyframe, SlideKeyframe };
