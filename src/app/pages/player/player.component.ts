import {
  Component,
  computed,
  effect,
  inject,
  viewChildren,
} from '@angular/core';
import { PlayerStateService } from '../../../core/services/player/player-state.service';
import { SlideComponent } from './components/slide/slide.component';
import { LayerComponent } from './components/layer/layer.component';
import { LayerService } from 'src/core/services/layer/layer.service';
import { Layer } from 'src/core/models/renderer/slide/layer/layer.model';
import { ReversePipe } from 'src/core/pipes/reverse/reverse.pipe';
import { Slide } from 'src/core/models/renderer/slide/slide.model';
import { LegacyService } from 'src/core/services/legacy/legacy.service';
import { TimelineSliderComponent } from './components/timeline-slider/timeline-slider.component';
import { TimelineService } from 'src/core/services/timeline/timeline.service';
import gsap from 'gsap';
import { PlayerService } from 'src/core/services/player/player.service';

@Component({
  imports: [
    SlideComponent,
    LayerComponent,
    ReversePipe,
    TimelineSliderComponent,
  ],
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent {
  private readonly playerState = inject(PlayerStateService);
  private readonly playerService = inject(PlayerService);
  private readonly layerService = inject(LayerService);
  private readonly timelineService = inject(TimelineService);
  private readonly legacyService = inject(LegacyService);

  private readonly slideComponents = viewChildren(SlideComponent);
  private readonly layerComponents = viewChildren(LayerComponent);

  private readonly layerComponentsReady = computed(() =>
    Boolean(this.layerComponents().length),
  );

  readonly slides = computed(() => {
    const scaled = this.playerState.builderDataScaled();
    const original = this.playerState.builderData();
    return scaled ?? original;
  });

  readonly masterTimeline = this.timelineService.masterTimeline;

  constructor() {
    const readyRef = effect(() => {
      if (this.layerComponentsReady()) {
        this.initialize();
        readyRef.destroy();
      }
    });
  }

  private initialize(): void {
    for (const layerComponent of this.layerComponents()) {
      const layer = layerComponent.layer();
      const element = layerComponent.layerComponent()!.element()!
        .nativeElement!;

      const staticProperties = this.layerService.getStaticProperties(layer);
      gsap.set(element, { ...staticProperties, position: 'absolute' });
    }

    const slides = this.slides()!;
    const slideTimelines: gsap.core.Timeline[] = [];
    for (const [i, slide] of slides.entries()) {
      const last = i === slides.length - 1;
      const slideElement = this.getSlideElementBySlide(slide);
      const slideTimeline = this.getSlideAnimation(slide, slideElement, last);
      slideTimelines.push(slideTimeline);
    }

    const masterTimeline = gsap.timeline({ paused: true });
    const hasDataJson = Boolean(this.playerState.dataJson());
    let cumulativeDuration = 0;
    for (const [i, slideTimeline] of slideTimelines.entries()) {
      masterTimeline.add(slideTimeline, cumulativeDuration / 1000);
      slideTimeline.play();
      cumulativeDuration += slides[i].properties.duration;

      // --- Setup event listeners --- //
      const first = i === 0;
      const last = i === slideTimelines.length - 1;
      slideTimeline.eventCallback('onStart', () => {
        this.playerService.activeSlide.set(slides[i]);
        if (first) {
          this.legacyService.logInitMessage(hasDataJson);
        }
      });
      slideTimeline.eventCallback('onComplete', () => {
        this.legacyService.logEndSlideMessage();
        if (last) this.legacyService.logEndTemplateMessage();
      });
      // --- ********************** --- //
    }

    masterTimeline.repeat(-1);
    masterTimeline.play();
    this.masterTimeline.set(masterTimeline);
    this.timelineService.slideTimelines.set(slideTimelines);

    // let index = 0;
    // slideTimelines.forEach((timeline, i) => {
    //   timeline.eventCallback('onComplete', () => {
    //     if (this.destroyRef.destroyed) return;

    //     const currentIndex = index % slideTimelines.length;
    //     const nextIndex = (currentIndex + 1) % slideTimelines.length;
    //     index++;

    //     const last = currentIndex + 1 === slideTimelines.length;
    //     const nextTimeline = slideTimelines[nextIndex];
    //     const playNext = () => {
    //       nextTimeline.seek(0);
    //       nextTimeline.play();
    //     };

    //     this.legacyService.logEndSlideMessage();
    //     if (last) {
    //       this.legacyService.logEndTemplateMessage();
    //     }

    //     if (last && this.legacyService.hasParentEvent()) {
    //       // TODO: REMOVE THIS AFTER TEST
    //       const getDelayFromLocalStorage = () => {
    //         try {
    //           const key = 'RENDERER_LOOP_DELAY';
    //           const value = localStorage.getItem(key);
    //           if (value !== null && typeof value === 'string') {
    //             const valueNum = parseInt(value);
    //             if (!isNaN(valueNum)) return valueNum;
    //           }
    //         } catch (error) {
    //           // NOTE: Ignore error
    //           console.log(error);
    //         }
    //         return 0;
    //       };

    //       const delayBeforeLoopMs = getDelayFromLocalStorage() || 1000;
    //       setTimeout(() => {
    //         playNext();
    //       }, delayBeforeLoopMs);
    //     } else {
    //       playNext();
    //     }
    //   });

    //   timeline.eventCallback('onStart', () => {
    //     this.playerService.activeSlide.set(slides[i]);
    //     if (i === 0) {
    //       this.legacyService.logInitMessage(
    //         Boolean(this.playerState.dataJson()),
    //       );

    //       const lastSlide = slides[slides.length - 1];
    //       const lastSlideElement = this.getSlideElementBySlide(lastSlide);
    //       gsap.set(lastSlideElement, { display: 'none' });
    //     }
    //   });
    // });

    // slideTimelines[0].play();
  }

  private getSlideAnimation(
    slide: Slide,
    slideElement: HTMLElement,
    last: boolean,
  ): gsap.core.Timeline {
    const layers = slide.layers;
    const duration = slide.properties.duration / 1000;

    const layerTimelines = layers.map((layer) => {
      const layerElement = this.getLayerElementByLayer(layer);
      return this.layerService.getLayerTimeline(layer, layerElement);
    });

    const timeline = gsap.timeline({ paused: true });
    timeline.set(slideElement, { display: 'block' });

    timeline.add([
      ...layerTimelines,
      last
        ? gsap.to(document.createElement('div'), {
            delay: duration,
            duration: 0,
          })
        : gsap.to(slideElement, {
            display: 'none',
            delay: duration,
            duration: 0,
          }),
    ]);

    return timeline;
  }

  private getLayerElementByLayer(layer: Layer): HTMLElement {
    const layerComponent = this.layerComponents().find(
      (layerComponent) => layerComponent.layer() === layer,
    );

    const element = layerComponent?.layerComponent()?.element()!.nativeElement!;
    return element;
  }

  private getSlideElementBySlide(slide: Slide): HTMLElement {
    const slideComponent = this.slideComponents().find(
      (slideComponent) => slideComponent.slide() === slide,
    );
    const element = slideComponent?.slideElement()?.nativeElement!;
    return element;
  }
}
