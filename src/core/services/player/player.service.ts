import { inject, Injectable, signal } from '@angular/core';
import { ImageLayer } from 'src/core/models/renderer/slide/layer/image-layer.model';
import { VideoLayer } from 'src/core/models/renderer/slide/layer/video-layer.model';
import { PlayerStateService } from './player-state.service';
import { TextLayer } from 'src/core/models/renderer/slide/layer/text-layer.model';
import { Slide } from 'src/core/models/renderer/slide/slide.model';
import { DataJsonSlidePlaceholder } from 'src/core/models/renderer/template-data/data-json.model';
import { ShapeColors } from 'src/core/models/renderer/slide/layer/shape-colors.model';
import { Layer } from 'src/core/models/renderer/slide/layer/layer.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playerState = inject(PlayerStateService);
  readonly activeSlide = signal<Slide | undefined>(undefined, {
    equal: () => false,
  });

  private readonly templateJson = this.playerState.templateJson;
  private readonly dataJson = this.playerState.dataJsonWithAttributes;

  getSrcByLayer(layer: ImageLayer | VideoLayer): string {
    const templateJson = this.templateJson();
    for (const placeholder of templateJson?.Placeholders!) {
      if (placeholder.Reference === layer.id) {
        const ref = placeholder.Reference;
        const dataJsonPH = this.getDataJsonPlaceholderByRef(ref);

        if (dataJsonPH) {
          const src = dataJsonPH.localPathValue || dataJsonPH.value;
          return src;
        }

        return placeholder.FieldPlaceholder;
      }
    }

    return '';
  }

  getTextValueByLayer(layer: TextLayer): string {
    const templateJson = this.templateJson();
    for (const placeholder of templateJson?.Placeholders!) {
      if (placeholder.Reference === layer.id) {
        const ref = placeholder.Reference;
        const dataJsonPH = this.getDataJsonPlaceholderByRef(ref);
        if (dataJsonPH) return dataJsonPH.value;
        return placeholder.FieldPlaceholder;
      }
    }

    return '';
  }

  getShapeColorsByLayer(layer: Layer<unknown>): ShapeColors {
    const dataJson = this.dataJson();
    if (!dataJson) return {};

    const shapeColors: ShapeColors = {};

    const ref = layer.id;
    const outlinePH = this.getDataJsonPlaceholderByRef([ref, 'OL'].join('-'));
    const backgroundColorPH = this.getDataJsonPlaceholderByRef(
      [ref, 'BG'].join('-'),
    );

    const extractRenderedText = (input: string): string => {
      const tmp = document.createElement('div');
      tmp.innerHTML = input;
      return tmp.textContent?.trim() ?? '';
    };

    if (outlinePH && outlinePH.value) {
      const outlineColour = extractRenderedText(outlinePH.value);
      if (outlineColour) shapeColors.outlineColour = outlineColour;
    }

    if (backgroundColorPH && backgroundColorPH.value) {
      const backgroundColor = extractRenderedText(backgroundColorPH.value);
      if (backgroundColor) shapeColors.backgroundColour = backgroundColor;
    }

    return shapeColors;
  }

  private getDataJsonPlaceholderByRef(
    ref: string,
  ): DataJsonSlidePlaceholder | null {
    const dataJson = this.dataJson();
    if (!dataJson) return null;

    for (const slide of dataJson.slides) {
      for (const placeholder of slide.placeholders) {
        if (placeholder.reference === ref) {
          return placeholder;
        }
      }
    }

    return null;
  }
}
