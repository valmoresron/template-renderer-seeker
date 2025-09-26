import { AsyncPipe } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { TimelineService } from 'src/core/services/timeline/timeline.service';

@Component({
  imports: [AsyncPipe],
  selector: 'app-timeline-slider',
  templateUrl: './timeline-slider.component.html',
  styleUrl: './timeline-slider.component.scss',
})
export class TimelineSliderComponent {
  @HostListener('window:keydown.space')
  onSpacebar(): void {
    this.onTogglePause();
  }

  @HostListener('window:keydown.arrowLeft')
  onLeftArrow(): void {
    const currentTime = this.timeline().time();
    const backwardTime = Math.max(0, currentTime - 5);
    this.timelineService.seek(backwardTime);
  }

  @HostListener('window:keydown.arrowRight')
  onRightArrow(): void {
    const duration = this.timeline().duration();
    const currentTime = this.timeline().time();
    const forwardTime = Math.min(duration - 1, currentTime + 5);
    this.timelineService.seek(forwardTime);
  }

  private readonly timelineService = inject(TimelineService);

  readonly timeline = computed(() => this.timelineService.masterTimeline()!);

  readonly duration = computed(() => this.timeline().duration());
  readonly currentTime = signal<number>(0);
  readonly pauseTick = signal<boolean>(false);
  readonly paused = signal<boolean>(false);

  readonly currentTimeStr$ = toObservable(
    computed(() => this.formatColonTime(this.currentTime())),
  ).pipe(distinctUntilChanged());

  readonly durationStr = computed(() => this.formatColonTime(this.duration()));

  constructor() {
    this.timelineService.gsapTick$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.onGsapTick());
  }

  private onGsapTick(): void {
    if (!this.pauseTick()) {
      const timeline = this.timeline();
      this.currentTime.set(timeline.time());

      const paused = timeline.paused();
      if (paused !== this.paused()) {
        this.paused.set(paused);
      }
    }
  }

  onSeek(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const valueNum = parseFloat(value);
    this.timelineService.seek(valueNum);
  }

  onTogglePause(): void {
    if (this.paused()) {
      this.timelineService.play();
    } else {
      this.timelineService.pause();
    }
  }

  private formatColonTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    } else {
      return `${pad(mins)}:${pad(secs)}`;
    }
  }
}
