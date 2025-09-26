import { effect, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  readonly mainViewport = signal<HTMLDivElement | null>(null);
}
