import { ElementRef, Signal } from '@angular/core';
import { Slide } from 'src/core/models/renderer/slide/slide.model';

interface ISlideComponent {
  slide: Signal<Slide>;
  slideElement: Signal<ElementRef<HTMLDivElement> | undefined>;
}

export type { ISlideComponent };
