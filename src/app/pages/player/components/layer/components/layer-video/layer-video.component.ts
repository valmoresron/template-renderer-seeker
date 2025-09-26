import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ILayerComponent } from '../../models/layer-component.model';
import { VideoLayer } from 'src/core/models/renderer/slide/layer/video-layer.model';
import { ResolutionService } from 'src/core/services/resolution/resolution.service';
import { PlayerService } from 'src/core/services/player/player.service';
import { SetSrcDirective } from 'src/core/directives/set-src/set-src.directive';
import { ForcePlayDirective } from 'src/core/directives/force-play/force-play.directive';
import { PlayerStateService } from 'src/core/services/player/player-state.service';
import { BlankComponent } from '../blank/blank.component';
import { BlankType } from '../blank/models/blank-type.model';
import { TimelineService } from 'src/core/services/timeline/timeline.service';

@Component({
  imports: [SetSrcDirective, ForcePlayDirective, BlankComponent],
  selector: 'app-layer-video',
  templateUrl: './layer-video.component.html',
  styleUrl: './layer-video.component.scss',
})
export class LayerVideoComponent implements ILayerComponent {
  private readonly playerService = inject(PlayerService);
  private readonly playerState = inject(PlayerStateService);
  private readonly timelineService = inject(TimelineService);

  readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');
  private readonly slides = this.playerState.builderData;

  readonly element = viewChild<ElementRef<HTMLDivElement>>('element');
  readonly layer = input.required<VideoLayer>();
  readonly slide = computed(() =>
    this.slides()?.find((slide) =>
      slide.layers.some((l) => l === this.layer()),
    ),
  );

  readonly resolution = inject(ResolutionService).resolution;
  readonly objectFit = computed(() => this.getObjectFit());
  readonly src = computed(() => this.getSrc());
  readonly isBlankSrc = computed(() => this.src() === 'blank-video.mp4');
  readonly blankType = signal(BlankType.Video).asReadonly();

  readonly paused = this.timelineService.paused;

  constructor() {
    effect(() => {
      const activeSlide = this.playerService.activeSlide();
      const isActiveSlide = this.slide() === activeSlide;
      const video = this.video();
      if (isActiveSlide && video) {
        video.nativeElement.currentTime = 0;
      }
    });

    effect(() => {
      if (this.paused()) {
        this.video()?.nativeElement.pause();
      } else {
        this.video()?.nativeElement.play();
      }
    });
  }

  private getObjectFit(): string {
    const resolution = this.resolution();
    const resStr = [resolution.width, resolution.height].join('x');
    const layerResolution = this.layer().resolutions[resStr];
    const objectFit = layerResolution.properties.videoFit;
    return objectFit;
  }

  private getSrc(): string {
    return this.playerService.getSrcByLayer(this.layer());
  }
}
