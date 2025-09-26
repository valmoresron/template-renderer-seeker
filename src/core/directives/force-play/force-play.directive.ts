import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[forcePlay]',
})
export class ForcePlayDirective {
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  readonly forcePlay = input.required<boolean>();

  constructor() {
    const ensurePlaying = () => {
      const video = this.el.nativeElement as HTMLVideoElement;
      if (video.paused || video.readyState < 3) {
        video.play().catch((err) => {
          console.warn('Playback attempt failed:', err);
        });
      }
    };

    const watchdogInterval = setInterval(() => {
      if (this.destroyRef.destroyed) {
        clearInterval(watchdogInterval);
      }

      if (typeof this.forcePlay() === 'boolean') {
        if (this.forcePlay()) {
          ensurePlaying();
        }
      } else {
        ensurePlaying();
      }
    }, 500);
  }
}
