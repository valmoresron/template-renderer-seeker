import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ILayerComponent } from '../../models/layer-component.model';
import { PlayerService } from 'src/core/services/player/player.service';
import { ResolutionService } from 'src/core/services/resolution/resolution.service';
import { SetSrcDirective } from 'src/core/directives/set-src/set-src.directive';
import { ImageLayer } from 'src/core/models/renderer/slide/layer/image-layer.model';
import { BlankType } from '../blank/models/blank-type.model';
import { BlankComponent } from '../blank/blank.component';

@Component({
  imports: [SetSrcDirective, BlankComponent],
  selector: 'app-layer-image',
  templateUrl: './layer-image.component.html',
  styleUrl: './layer-image.component.scss',
})
export class LayerImageComponent implements ILayerComponent {
  private playerService = inject(PlayerService);
  readonly element = viewChild<ElementRef<HTMLDivElement>>('element');
  readonly layer = input.required<ImageLayer>();

  readonly resolution = inject(ResolutionService).resolution;
  readonly objectFit = computed(() => this.getObjectFit());
  readonly src = computed(() => this.getSrc());
  readonly isBlankSrc = computed(() => this.src() === 'blank-image.jpeg');
  readonly blankType = signal(BlankType.Image).asReadonly();

  private getObjectFit(): string {
    const resolution = this.resolution();
    const resStr = [resolution.width, resolution.height].join('x');
    const layerResolution = this.layer().resolutions[resStr];
    const objectFit = layerResolution.properties.imageFit;
    return objectFit;
  }

  private getSrc(): string {
    return this.playerService.getSrcByLayer(this.layer());
  }
}
