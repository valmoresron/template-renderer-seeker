import { AsyncPipe } from '@angular/common';
import {
  Component,
  computed,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import gsap from 'gsap';
import { distinctUntilChanged } from 'rxjs';

@Component({
  imports: [AsyncPipe],
  selector: 'app-timeline-slider',
  templateUrl: './timeline-slider.component.html',
  styleUrl: './timeline-slider.component.scss',
})
export class TimelineSliderComponent implements OnInit, OnDestroy {
  readonly timeline = input.required<gsap.core.Timeline>();

  readonly duration = computed(() => this.timeline().duration());
  readonly currentTime = signal<number>(0);
  readonly pauseTick = signal<boolean>(false);
  readonly paused = signal<boolean>(false);

  readonly currentTimeStr$ = toObservable(
    computed(() => this.formatColonTime(this.currentTime())),
  ).pipe(distinctUntilChanged());

  readonly durationStr = computed(() => this.formatColonTime(this.duration()));

  private gsapTickCallback: (() => void) | null = null;

  ngOnInit(): void {
    const callback = () => this.onGsapTick();
    gsap.ticker.add(callback);
    this.gsapTickCallback = callback;
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
    this.timeline().seek(valueNum);
  }

  onTogglePause(): void {
    if (this.paused()) {
      this.timeline().play();
    } else {
      this.timeline().pause();
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

  ngOnDestroy(): void {
    if (this.gsapTickCallback) {
      gsap.ticker.remove(this.gsapTickCallback);
    }
  }
}
