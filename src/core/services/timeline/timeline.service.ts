import { effect, inject, Injectable, signal } from '@angular/core';
import gsap from 'gsap';
import { Subject } from 'rxjs';
import { PlayerService } from '../player/player.service';
import { PlayerStateService } from '../player/player-state.service';
import { Slide } from 'src/core/models/renderer/slide/slide.model';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private playerService = inject(PlayerService);
  private playerState = inject(PlayerStateService);

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
    const masterTimeline = this.masterTimeline();
    if (masterTimeline) {
      const activeSlideFromThisSeconds = this.getSlideFromDuration(seconds);
      if (activeSlideFromThisSeconds) {
        this.playerService.activeSlide.set(activeSlideFromThisSeconds);
      }

      masterTimeline.seek(seconds);
    }
  }

  pause(): void {
    this.masterTimeline()?.pause();
    this.paused.set(true);
  }

  play(): void {
    this.masterTimeline()?.play();
    this.paused.set(false);
  }

  private getSlideFromDuration(duration: number): Slide | null {
    const slides = this.playerState.slides();

    if (slides) {
      let totalDuration = 0;
      let prevSlide = slides[0];
      for (const slide of slides) {
        totalDuration += slide.properties.duration / 1000;
        if (totalDuration > duration) {
          break;
        }
      }

      return prevSlide;
    }

    return null;
  }
}
