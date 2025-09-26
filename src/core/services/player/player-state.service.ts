import { computed, inject, Injectable } from '@angular/core';
import { PlayerResourceService } from './player-resource.service';
import { ContentJson } from '../../models/renderer/template-data/content-json.model';
import { HttpResourceRef } from '@angular/common/http';
import { Resolution2 } from '../../models/renderer/resolution.model';
import { Resolution } from '../../models/resolution/resolution.model';
import { Attribute } from 'src/core/models/renderer/template-data/attribute.model';
import { AssetAttribute } from 'src/core/models/renderer/template-data/asset-attribute.model';
import { DataJson } from 'src/core/models/versions/1.4.0-storya.6/v6.model';
import { ResolutionService } from '../resolution/resolution.service';
import { TemplateBuilderData } from 'src/core/models/renderer/template-data/template-builder-data.model';
import { scaleBuilderData } from './scaler';
import { Orientation } from 'src/core/models/resolution/orientation.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerStateService {
  private resolutionService = inject(ResolutionService);
  private playerResource = inject(PlayerResourceService);

  readonly loadingData = computed(() =>
    this.playerResource.resources.some((resource) => resource.isLoading()),
  );

  readonly templateJson = computed(() =>
    this.getValue(this.playerResource.templateJson),
  );
  readonly dataJson = computed(() =>
    this.getValue(this.playerResource.dataJson),
  );
  readonly builderData = computed(() =>
    this.getValue(this.playerResource.builderData),
  );
  readonly contentJson = computed(() =>
    this.getContentJson(this.getValue(this.playerResource.contentJs)),
  );
  readonly supportedResolutions = computed(() =>
    this.parseResolutions(
      this.getValue(this.playerResource.supportedResolutions) ?? [],
    ),
  );

  readonly dataJsonWithAttributes = computed(() =>
    this.getDataJsonWithAttributes(),
  );

  readonly isResolutionSupported = computed(() =>
    this.getIsResolutionSupported(),
  );

  readonly compatibleResolutions = computed(() =>
    this.getCompatibleResolutions(),
  );

  readonly builderDataScaled = computed(() => this.getBuilderDataScaled());

  readonly slides = computed(() => {
    const scaled = this.builderDataScaled();
    const original = this.builderData();
    return scaled ?? original;
  });

  // -------- FUNCTIONS ------------- //

  private getContentJson(contentJs?: string): ContentJson | undefined {
    if (!contentJs || typeof contentJs !== 'string') {
      return undefined;
    }

    try {
      const contentJsTrimmed = contentJs.trim();
      const equalsIndex = contentJsTrimmed.indexOf('=');
      if (equalsIndex > -1) {
        const afterEquals = contentJsTrimmed
          .slice(equalsIndex + 1, contentJsTrimmed.length)
          .trim();

        const noSemicolon = afterEquals.endsWith(';')
          ? afterEquals.slice(0, -1)
          : afterEquals;

        const contentJs = JSON.parse(noSemicolon) as ContentJson;
        return contentJs;
      }

      return undefined;
    } catch (error) {
      console.log('Error parsing content.js', error);
    }

    return undefined;
  }

  private replaceWithAttribute(str: string): string {
    const contentJson = this.contentJson();
    if (!contentJson) return str;

    let newStr = str;
    for (const attribute of contentJson.Location.Attributes) {
      const parsedAttribute = this.parseAssetAttribute(attribute);
      const strToReplace = `@{location.attribute['${parsedAttribute.Key}']}`;
      newStr = newStr.replaceAll(strToReplace, parsedAttribute.Value);
    }
    return newStr;
  }

  private getValue<T>(httpResource: HttpResourceRef<T>): T | undefined {
    if (httpResource.error() || !httpResource.hasValue()) return undefined;
    return httpResource.value();
  }

  private parseResolutions(resolutions: Resolution2[]): Resolution[] {
    return resolutions.map(({ width, height }) => ({ width, height }));
  }

  private parseAssetAttribute(attribute: Attribute): Attribute {
    if (!attribute) return attribute;
    if (!attribute.Key || !attribute.Value) return attribute;
    if (typeof attribute.Value !== 'string') return attribute;

    try {
      const assetAttribute = JSON.parse(attribute.Value) as AssetAttribute;
      const isAssetAttribute =
        assetAttribute && assetAttribute.Id && assetAttribute.Url;
      if (!isAssetAttribute) return attribute;
      if (typeof assetAttribute.Url !== 'string') return attribute;

      const newAttribute: Attribute = {
        Key: attribute.Key,
        Value: assetAttribute.Url,
      };

      return newAttribute;
    } catch (error) {
      return attribute;
    }
  }

  private getDataJsonWithAttributes(): DataJson | undefined {
    const dataJson = this.dataJson();
    const contentJson = this.contentJson();

    if (dataJson && contentJson) {
      const newDataJson = structuredClone(dataJson);
      for (const slide of newDataJson.slides) {
        for (const placeholder of slide.placeholders) {
          if (placeholder.value && typeof placeholder.value === 'string') {
            placeholder.value = this.replaceWithAttribute(placeholder.value);
          }
        }
      }

      return newDataJson;
    }

    return dataJson;
  }

  private getCompatibleResolutions(): Resolution[] {
    const resolution = this.resolutionService.resolution();
    const resolutions = this.supportedResolutions();

    const compatibleResolutions: Resolution[] = [];
    for (const res of resolutions) {
      const { width, height } = res;
      for (let i = 0.25; i <= 5; i += 0.05) {
        const scaleFactor = i;
        let scaledWidth = parseInt((width / scaleFactor).toFixed(0));
        let scaledHeight = parseInt((height / scaleFactor).toFixed(0));
        if (scaledWidth % 2 === 1) scaledWidth++;
        if (scaledHeight % 2 === 1) scaledHeight++;

        const isExactScale =
          scaledWidth === resolution.width &&
          scaledHeight === resolution.height;

        const pixelAllowance = 3;
        const isWithinRangeScale =
          Math.abs(scaledWidth - resolution.width) <= pixelAllowance &&
          Math.abs(scaledHeight - resolution.height) <= pixelAllowance;

        if (isExactScale || isWithinRangeScale) {
          compatibleResolutions.push(res);
          break;
        }
      }
    }

    return compatibleResolutions;
  }

  private getIsResolutionSupported(): boolean {
    const { width, height } = this.resolutionService.resolution();
    const supportedResolutions = this.supportedResolutions();
    if (!supportedResolutions.length) return false;

    const supported = supportedResolutions.some(
      (res) => res.width === width && res.height === height,
    );

    return supported;
  }

  private getBuilderDataScaled(): TemplateBuilderData | undefined {
    const resolution = this.resolutionService.resolution();
    const orientation = this.resolutionService.orientation();
    const isResolutionSupported = this.isResolutionSupported();
    const compatibleResolutions = this.compatibleResolutions();
    const supportedResolutionsWithSameOrientation =
      this.supportedResolutions().filter((res) => {
        const isLandscape = res.width >= res.height;
        if (orientation === Orientation.Landscape) {
          return isLandscape;
        } else {
          return !isLandscape;
        }
      });
    const builderData = this.builderData();

    if (
      !compatibleResolutions.length ||
      !supportedResolutionsWithSameOrientation.length ||
      !builderData ||
      isResolutionSupported
    ) {
      return undefined;
    }

    const sorted = [...supportedResolutionsWithSameOrientation].sort(
      (a, b) =>
        Math.abs(a.width * a.height - resolution.width * resolution.height) -
        Math.abs(b.width * b.height - resolution.width * resolution.height),
    );

    const closestRes = sorted[0];

    try {
      const scaledBuilderData = structuredClone(builderData);
      scaleBuilderData(scaledBuilderData, closestRes, resolution);
      return scaledBuilderData;
    } catch (error) {
      console.log('Error occured when trying to scale builder data: ', error);
    }

    return undefined;
  }
}
