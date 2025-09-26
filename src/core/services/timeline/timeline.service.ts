import { Injectable, signal } from '@angular/core';
import gsap from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  readonly masterTimeline = signal<gsap.core.Timeline | null>(null);
  readonly slideTimelines = signal<gsap.core.Timeline[]>([]);
}
