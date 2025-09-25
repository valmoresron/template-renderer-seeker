import { inject, Injectable } from '@angular/core';
import { CircleLayer } from 'src/core/models/renderer/slide/layer/circle-layer.model';
import { ImageLayer } from 'src/core/models/renderer/slide/layer/image-layer.model';
import { Layer } from 'src/core/models/renderer/slide/layer/layer.model';
import { RectangleLayer } from 'src/core/models/renderer/slide/layer/rectangle-layer.model';
import { TemplateLayer } from 'src/core/models/renderer/slide/layer/template-layer.model';
import {
  TextLayer,
  TextLayerResolutionProperties,
} from 'src/core/models/renderer/slide/layer/text-layer.model';
import { TriangleLayer } from 'src/core/models/renderer/slide/layer/triangle-layer.model';
import { VideoLayer } from 'src/core/models/renderer/slide/layer/video-layer.model';
import { ResolutionService } from '../resolution/resolution.service';
import gsap from 'gsap';
import { LayerType } from 'src/core/models/renderer/slide/layer/layer-type.model';
import { PlayerService } from '../player/player.service';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  private resolution = inject(ResolutionService).resolution;
  private playerService = inject(PlayerService);

  castLayer<T = TemplateLayer>(layer: Layer<unknown>): T {
    return layer as T;
  }

  getStaticProperties(layer: Layer<unknown>): Partial<CSSStyleDeclaration> {
    switch (layer.type) {
      case 'Circle':
        return this.getCircleStaticProperties(this.castLayer(layer));

      case 'Image':
        return this.getImageStaticProperties(this.castLayer(layer));

      case 'Rectangle':
        return this.getRectangleStaticProperties(this.castLayer(layer));

      case 'Text':
        return this.getTextStaticProperties(this.castLayer(layer));

      case 'Triangle':
        return this.getTriangleStaticProperties(this.castLayer(layer));

      case 'Video':
        return this.getVideoStaticProperties(this.castLayer(layer));

      default:
        return {};
    }
  }

  getLayerTimeline(
    layer: Layer<unknown>,
    element: HTMLElement,
  ): gsap.core.Timeline {
    const resolution = this.resolution();
    const resolutionStr = [resolution.width, resolution.height].join('x');
    const layerResolution = layer.resolutions[resolutionStr];

    const hidden = layerResolution.hidden;
    const animate = layerResolution.animate;
    const timeline = gsap.timeline();

    if (hidden) {
      gsap.set(element, { display: 'none' });
    }

    const timeframes = layerResolution.timeframes;
    for (let i = 0; i < timeframes.length; i++) {
      const properties: { [key: string]: string | number } = {};
      for (const property of layerResolution.keyframes) {
        const prop = property.property;
        const value = property.values[i];
        if (prop === 'x') properties['left'] = value;
        else if (prop === 'y') properties['top'] = value;
        else properties[prop] = value;
      }

      if (i === 0) {
        if (layer.type === 'Text') {
          const lproperties = layerResolution.properties;
          const textProperties = lproperties as TextLayerResolutionProperties;
          timeline.set(element, {
            ...properties,
            ...textProperties,
            lineHeight: textProperties.lineHeight + 'px',
          });
        } else {
          timeline.set(element, { ...properties });
        }
      }

      const duration = (timeframes[i] - timeframes[i - 1]) / 1000;
      timeline.to(element, { ...properties, duration });

      if (!animate) break;
    }

    return timeline;
  }

  //#region STATIC PROPERTIES

  private getCircleStaticProperties(
    layer: CircleLayer,
  ): Partial<CSSStyleDeclaration> {
    const shapeColors = this.playerService.getShapeColorsByLayer(layer);

    const props = layer.properties;
    const backgroundColor =
      shapeColors.backgroundColour || props.backgroundColour;
    const outlineColor = shapeColors.outlineColour || props.outlineColour;
    const outlineWeight = props.outlineWeight;
    const border = `${outlineWeight}px solid ${outlineColor}`;

    const properties: Partial<CSSStyleDeclaration> = {
      backgroundColor,
      border,
    };

    return properties;
  }

  private getImageStaticProperties(
    layer: ImageLayer,
  ): Partial<CSSStyleDeclaration> {
    const properties: Partial<CSSStyleDeclaration> = {};

    return properties;
  }

  private getRectangleStaticProperties(
    layer: RectangleLayer,
  ): Partial<CSSStyleDeclaration> {
    const props = layer.properties;
    const shapeColors = this.playerService.getShapeColorsByLayer(layer);

    const backgroundColor =
      shapeColors.backgroundColour || props.backgroundColour;
    const borderRadius = props.boxRadius;
    const outlineWeight = props.outlineWeight + 'px';
    const outlineColor = shapeColors.outlineColour || props.outlineColour;
    const border = `${outlineWeight} solid ${outlineColor}`;
    const position = 'absolute';

    const properties: Partial<CSSStyleDeclaration> = {
      position,
      backgroundColor,
      borderRadius,
      border,
    };

    return properties;
  }

  private getTextStaticProperties(
    layer: TextLayer,
  ): Partial<CSSStyleDeclaration> {
    const properties: Partial<CSSStyleDeclaration> = {};

    return properties;
  }

  private getTriangleStaticProperties(
    layer: TriangleLayer,
  ): Partial<CSSStyleDeclaration> {
    const props = layer.properties;
    const shapeColors = this.playerService.getShapeColorsByLayer(layer);
    const backgroundColor =
      shapeColors.backgroundColour || props.backgroundColour;

    const properties: Partial<CSSStyleDeclaration> = { backgroundColor };

    return properties;
  }

  private getVideoStaticProperties(
    layer: VideoLayer,
  ): Partial<CSSStyleDeclaration> {
    const properties: Partial<CSSStyleDeclaration> = {};

    return properties;
  }

  setTextStyle(layer: TextLayer, element: HTMLDivElement): void {
    const { fontColour, fontFamily } = layer.properties;
    gsap.set(element, { color: fontColour, fontFamily });
  }

  //#endregion
}
