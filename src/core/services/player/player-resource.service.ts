import { httpResource, HttpResourceRef } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import { TemplateBuilderData } from '../../models/renderer/template-data/template-builder-data.model';
import { TemplateJson } from '../../models/renderer/template-data/template-json.model';
import { Resolution2 } from '../../models/renderer/resolution.model';
import { DataJson } from 'src/core/models/renderer/template-data/data-json.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerResourceService {
  readonly templateJson = httpResource<TemplateJson>(() => 'template.json');
  readonly dataJson = httpResource<DataJson>(() => 'data.json');
  readonly builderData = httpResource<TemplateBuilderData>(() =>
    this.useMasterBuilderData()
      ? 'master-builder-data.json'
      : 'builder-data.json',
  );
  readonly contentJs = httpResource.text(() => 'content.js');
  readonly supportedResolutions = httpResource<Resolution2[]>(
    () => 'supported-resolutions.json',
  );

  get resources(): HttpResourceRef<unknown>[] {
    const resources = [
      this.templateJson,
      this.dataJson,
      this.builderData,
      this.contentJs,
      this.supportedResolutions,
    ];

    return resources;
  }

  constructor() {
    this.resources.map((resource) => resource.reload());
  }

  private useMasterBuilderData(): boolean {
    const urlParams = window.location.search;
    const params = new URLSearchParams(urlParams);
    const master = params.get('master');
    const useMasterBuilderData = master && master.toLowerCase() === 'true';
    return Boolean(useMasterBuilderData);
  }
}
