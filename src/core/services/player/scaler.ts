import { CircleLayer } from 'src/core/models/renderer/slide/layer/circle-layer.model';
import { ImageLayer } from 'src/core/models/renderer/slide/layer/image-layer.model';
import { Layer } from 'src/core/models/renderer/slide/layer/layer.model';
import { RectangleLayer } from 'src/core/models/renderer/slide/layer/rectangle-layer.model';
import { TextLayer } from 'src/core/models/renderer/slide/layer/text-layer.model';
import { TriangleLayer } from 'src/core/models/renderer/slide/layer/triangle-layer.model';
import { VideoLayer } from 'src/core/models/renderer/slide/layer/video-layer.model';
import { Slide } from 'src/core/models/renderer/slide/slide.model';
import { Resolution } from 'src/core/models/resolution/resolution.model';
import { LayerResolution } from 'src/core/models/template-editor/layer';
import { Keyframe } from 'src/core/models/renderer/slide/keyframe.model';
import { TemplateBuilderData } from 'src/core/models/renderer/template-data/template-builder-data.model';

function clearBlankTimeframes(slides: Slide[]): void {
  for (const slide of slides) {
    for (const layer of slide.layers ?? []) {
      for (const key in layer.resolutions) {
        const resolution = (
          layer.resolutions as unknown as { [key: string]: unknown }
        )[key] as LayerResolution;
        if (resolution) {
          const timeframes = resolution.timeframes;
          if (!timeframes || !Array.isArray(timeframes)) {
            resolution.timeframes = [];
            if (resolution.keyframes && Array.isArray(resolution.keyframes)) {
              for (const keyframe of resolution.keyframes) {
                const values = (keyframe as unknown as Keyframe).values;
                if (values && Array.isArray(values)) {
                  (keyframe as unknown as Keyframe).values = [];
                }
              }
            }
          }
        }
      }
    }
  }
}

function scaleShape(
  layer: RectangleLayer | CircleLayer | TriangleLayer | ImageLayer | VideoLayer,
  from: Resolution,
  to: Resolution,
): Layer {
  const scaleWidth = to.width / from.width;
  const scaleHeight = to.height / from.height;

  const scaledLayer = structuredClone(layer);

  const fromResolution =
    scaledLayer.resolutions[`${from.width}x${from.height}`];
  if (!fromResolution) return scaledLayer;

  const toResolution = structuredClone(fromResolution);
  for (const keyframe of toResolution.keyframes) {
    if (keyframe.property === 'width') {
      keyframe.values = (keyframe.values as number[]).map(
        (value) => value * scaleWidth,
      );
    } else if (keyframe.property === 'height') {
      keyframe.values = (keyframe.values as number[]).map(
        (value) => value * scaleHeight,
      );
    } else if (keyframe.property === 'x') {
      keyframe.values = (keyframe.values as number[]).map(
        (value) => value * scaleWidth,
      );
    } else if (keyframe.property === 'y') {
      keyframe.values = (keyframe.values as number[]).map(
        (value) => value * scaleHeight,
      );
    }
  }

  scaledLayer.resolutions[`${to.width}x${to.height}`] = toResolution;

  return scaledLayer;
}

function scaleText(layer: TextLayer, from: Resolution, to: Resolution): Layer {
  const scaleWidth = to.width / from.width;
  const scaleHeight = to.height / from.height;

  const scaledLayer = structuredClone(layer);

  const fromResolution =
    scaledLayer.resolutions[`${from.width}x${from.height}`];
  if (!fromResolution) return scaledLayer;

  const toResolution = structuredClone(fromResolution);
  const properties = toResolution.properties;
  if (properties) {
    if (properties.fontSize) {
      const value = parseInt(properties.fontSize);
      if (!isNaN(value)) properties.fontSize = (value * scaleWidth).toString();
    }
    if (properties.letterSpacing) {
      const value = parseInt(String(properties.letterSpacing));
      if (!isNaN(value))
        properties.letterSpacing = (
          value * scaleWidth
        ).toString() as unknown as number;
    }
    if (properties.lineHeight) {
      const value = parseInt(String(properties.lineHeight));
      if (!isNaN(value))
        properties.lineHeight = (
          value * scaleHeight
        ).toString() as unknown as number;
    }
    if (properties.wordSpacing) {
      const value = parseInt(String(properties.wordSpacing));
      if (!isNaN(value))
        properties.wordSpacing = (
          value * scaleWidth
        ).toString() as unknown as number;
    }
  }

  for (const keyframe of toResolution.keyframes) {
    if (keyframe.property === 'width') {
      keyframe.values = (keyframe.values as number[]).map(
        (value) => value * scaleWidth,
      );
    } else if (keyframe.property === 'height') {
      keyframe.values = (keyframe.values as number[]).map(
        (value) => value * scaleHeight,
      );
    } else if (keyframe.property === 'x') {
      keyframe.values = (keyframe.values as number[]).map(
        (value) => value * scaleWidth,
      );
    } else if (keyframe.property === 'y') {
      keyframe.values = (keyframe.values as number[]).map(
        (value) => value * scaleHeight,
      );
    }
  }

  scaledLayer.resolutions[`${to.width}x${to.height}`] = toResolution;

  return scaledLayer;
}

function scaleBuilderData(
  builderData: TemplateBuilderData,
  from: Resolution,
  to: Resolution,
): void {
  clearBlankTimeframes(builderData);
  for (const slide of builderData) {
    for (const [i, layer] of slide.layers.entries()) {
      let scaledLayer;
      switch (layer.type) {
        case 'Rectangle':
          scaledLayer = scaleShape(layer as RectangleLayer, from, to);
          break;
        case 'Circle':
          scaledLayer = scaleShape(layer as CircleLayer, from, to);
          break;
        case 'Triangle':
          scaledLayer = scaleShape(layer as TriangleLayer, from, to);
          break;
        case 'Image':
          scaledLayer = scaleShape(layer as ImageLayer, from, to);
          break;
        case 'Video':
          scaledLayer = scaleShape(layer as VideoLayer, from, to);
          break;
        case 'Text':
          scaledLayer = scaleText(layer as TextLayer, from, to);
          break;
        default:
          break;
      }

      if (scaledLayer) {
        slide.layers[i] = scaledLayer;
      }
    }
    return;
  }
}

export { scaleBuilderData };
