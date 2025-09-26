import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ISlideComponent } from './models/slide-component.model';
import { Slide } from 'src/core/models/renderer/slide/slide.model';
import gsap from 'gsap';
import { SetSrcDirective } from 'src/core/directives/set-src/set-src.directive';
import { ForcePlayDirective } from 'src/core/directives/force-play/force-play.directive';
import { PlayerService } from 'src/core/services/player/player.service';
import { ResolutionService } from 'src/core/services/resolution/resolution.service';

@Component({
  imports: [SetSrcDirective, ForcePlayDirective],
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.scss',
})
export class SlideComponent implements ISlideComponent {
  private readonly playerService = inject(PlayerService);
  private readonly resolutionService = inject(ResolutionService);

  readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');

  readonly slide = input.required<Slide>();
  readonly slideElement = viewChild<ElementRef<HTMLDivElement>>('slideElement');
  readonly isActiveSlide = computed(
    () => this.slide() === this.playerService.activeSlide(),
  );

  readonly backgroundType = computed(
    () => this.slide().properties.backgroundType,
  );
  readonly checkerBoardBackground = computed(
    () => this.backgroundType() === 'transparent',
  );
  readonly videoSrc = computed(
    () => this.slide().properties.backgroundVideo?.url,
  );

  readonly resolution = this.resolutionService.resolution;

  constructor() {
    const ref = effect(() => {
      this.setBackground();
      ref.destroy();
    });

    effect(() => {
      const isActiveSlide = this.isActiveSlide();
      const video = this.video();
      if (isActiveSlide && video) {
        video.nativeElement.currentTime = 0;
      }
    });
  }

  private setBackground(): void {
    const type = this.backgroundType();

    switch (type) {
      case 'image':
        this.setBackgroundImage();
        break;
      case 'solid':
        gsap.set(this.slideElement()?.nativeElement!, {
          backgroundColor: this.slide().properties.backgroundColour,
        });
        break;
      case 'video':
        break;
      case 'transparent':
        break;

      default:
        gsap.set(this.slideElement()?.nativeElement!, {
          backgroundColor: '#000000',
        });
        break;
    }
  }

  private setBackgroundImage(): void {
    const slide = this.slide();
    const element = this.slideElement()?.nativeElement!;
    const imageUrl = slide.properties.backgroundImage!.url;

    const css: Partial<CSSStyleDeclaration> = {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: slide.properties.backgroundFit,
      backgroundRepeat: slide.properties.backgroundRepeat,
      backgroundPosition: slide.properties.backgroundPosition,
    };
    gsap.set(element, css);
  }
}
