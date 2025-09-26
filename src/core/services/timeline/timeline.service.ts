import { effect, Injectable, signal } from '@angular/core';
import gsap from 'gsap';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  readonly gsapTick$ = new Subject<void>();

  readonly masterTimeline = signal<gsap.core.Timeline | null>(null);
  readonly slideTimelines = signal<gsap.core.Timeline[]>([]);

  readonly paused = signal<boolean>(false);

  constructor() {
    const initEffect = effect(() => {
      if (this.masterTimeline()) {
        gsap.ticker.add(() => this.gsapTick$.next());
        initEffect.destroy();
      }
    });
  }

  seek(seconds: number): void {
    this.masterTimeline()?.seek(seconds);
  }

  pause(): void {
    this.masterTimeline()?.pause();
    this.paused.set(true);
  }

  play(): void {
    this.masterTimeline()?.play();
    this.paused.set(false);
  }
}
