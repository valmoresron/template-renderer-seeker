import { Injectable, signal } from '@angular/core';
import { Resolution } from 'src/core/models/resolution/resolution.model';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  readonly mainViewport = signal<HTMLDivElement | null>(null);

  readonly zoneResolution = signal<Resolution | null>({
    width: 1920,
    height: 1080,
  });
}
