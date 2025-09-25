// Old model for version 1.4.0-storya.6

import { Keyframe } from './models/slide/keyframe.model';
import {
  Slide,
  SlideBackgroundMedia,
  SlideBackgroundType,
  SlideBackgroundFit,
} from './models/slide/slide.model';
import { LayerResolutions } from './models/slide/layer/layer-resolutions.model';
import { LayerType } from './models/slide/layer/layer-type.model';
import { Layer } from './models/slide/layer/layer.model';
import { ContentJson } from './models/template-data/content-json.model';
import {
  DataJsonSlidePlaceholder,
  DataJsonSlide,
  DataJson,
} from './models/template-data/data-json.model';
import { TemplateBuilderData } from './models/template-data/template-builder-data.model';
import {
  TemplateJSon,
  Placeholder,
} from './models/template-data/template-json.model';

import {
  VideoLayer,
  VideoLayerResolutionProperties,
  VideoFit,
} from './models/slide/layer/video-layer.model';

import {
  TriangleLayer,
  TriangleLayerResolutionProperties,
  TriangleLayerStaticProperties,
} from './models/slide/layer/triangle-layer.model';

import {
  TextLayer,
  TextLayerResolutionProperties,
  TextContent,
  TextLayerStaticProperties,
} from './models/slide/layer/text-layer.model';

import {
  RectangleLayer,
  RectangleLayerResolutionProperties,
  RectangleLayerStaticProperties,
} from './models/slide/layer/rectangle-layer.model';

import {
  ImageLayer,
  ImageLayerResolutionProperties,
  ImageLayerStaticProperties,
  ImageFit,
} from './models/slide/layer/image-layer.model';

import {
  CircleLayer,
  CircleLayerResolutionProperties,
  CircleLayerStaticProperties,
} from './models/slide/layer/circle-layer.model';

export type {
  Keyframe,
  Slide,
  SlideBackgroundMedia,
  SlideBackgroundType,
  SlideBackgroundFit,
  LayerResolutions,
  LayerType,
  Layer,
  VideoLayer,
  VideoLayerResolutionProperties,
  VideoFit,
  TriangleLayer,
  TriangleLayerResolutionProperties,
  TriangleLayerStaticProperties,
  TextLayer,
  TextLayerResolutionProperties,
  TextContent,
  TextLayerStaticProperties,
  RectangleLayer,
  RectangleLayerResolutionProperties,
  RectangleLayerStaticProperties,
  ImageLayer,
  ImageLayerResolutionProperties,
  ImageLayerStaticProperties,
  ImageFit,
  CircleLayer,
  CircleLayerResolutionProperties,
  CircleLayerStaticProperties,
  ContentJson,
  DataJson,
  DataJsonSlidePlaceholder,
  DataJsonSlide,
  TemplateBuilderData,
  TemplateJSon,
  Placeholder,
};
