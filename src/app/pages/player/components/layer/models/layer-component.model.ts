import { ElementRef, Signal } from '@angular/core';

interface ILayerComponent {
  element: Signal<ElementRef<HTMLElement> | undefined>;
}

export type { ILayerComponent };
