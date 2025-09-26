import { Injectable, signal } from '@angular/core';
import gsap from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  readonly masterTimeline = signal<gsap.core.Timeline | null>(null);
  readonly slideTimelines = signal<gsap.core.Timeline[]>([]);

  readonly paused = signal<boolean>(false);

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
