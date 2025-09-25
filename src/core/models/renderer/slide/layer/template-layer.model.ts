import { CircleLayer } from './circle-layer.model';
import { ImageLayer } from './image-layer.model';
import { RectangleLayer } from './rectangle-layer.model';
import { TextLayer } from './text-layer.model';
import { TriangleLayer } from './triangle-layer.model';
import { VideoLayer } from './video-layer.model';

type TemplateLayer =
  | CircleLayer
  | ImageLayer
  | RectangleLayer
  | TextLayer
  | TriangleLayer
  | VideoLayer;

export type { TemplateLayer };
