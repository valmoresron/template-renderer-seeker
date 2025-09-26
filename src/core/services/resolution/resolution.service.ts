import { computed, inject, Injectable, signal } from '@angular/core';
import { Resolution } from '../../models/resolution/resolution.model';
import { Orientation } from '../../models/resolution/orientation.model';
import { ZoneService } from '../zone/zone.service';

@Injectable({
  providedIn: 'root',
})
export class ResolutionService {
  private readonly zoneService = inject(ZoneService);
  private readonly zoneResolution = this.zoneService.zoneResolution;

  private readonly _resolution = signal(this.getCurrentResolution());

  readonly resolution = computed(
    () => this.zoneResolution() ?? this._resolution(),
  );
  readonly orientation = computed(() => this.getOrientation(this.resolution()));

  private getCurrentResolution(): Resolution {
    const resolution: Resolution = {
      width: document.body.offsetWidth,
      height: document.body.offsetHeight,
    };
    return resolution;
  }

  private getOrientation(resolution: Resolution): Orientation {
    const orientation =
      resolution.width >= resolution.height
        ? Orientation.Landscape
        : Orientation.Portrait;
    return orientation;
  }

  constructor() {
    window.addEventListener('resize', () =>
      this._resolution.set(this.getCurrentResolution()),
    );
  }
}
