import { effect, Injectable, signal } from '@angular/core';
import gsap from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class MasterTimelineService {
  readonly masterTimeline = signal<gsap.core.Timeline | null>(null);
}
