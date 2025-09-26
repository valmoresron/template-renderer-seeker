import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  readonly mainViewport = signal<HTMLDivElement | null>(null);
}
