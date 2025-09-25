import { Component, input, OnDestroy, OnInit } from '@angular/core';
import gsap from 'gsap';

@Component({
  imports: [],
  selector: 'app-timeline-slider',
  templateUrl: './timeline-slider.component.html',
  styleUrl: './timeline-slider.component.scss',
})
export class TimelineSliderComponent implements OnInit, OnDestroy {
  readonly timeline = input.required<gsap.core.Timeline>();

  private gsapTickCallback: (() => void) | null = null;

  ngOnInit(): void {
    const callback = () => this.onGsapTick();
    gsap.ticker.add(callback);
  }

  private onGsapTick(): void {
    const timeline = this.timeline();
    console.log(timeline.time());
  }

  ngOnDestroy(): void {
    if (this.gsapTickCallback) {
      gsap.ticker.remove(this.gsapTickCallback);
    }
  }
}
