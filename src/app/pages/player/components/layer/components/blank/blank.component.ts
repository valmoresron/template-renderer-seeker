import { Component, computed, inject, input } from '@angular/core';
import { BlankType } from './models/blank-type.model';
import { SvgService } from 'src/core/services/svg/svg.service';
import { SetSrcDirective } from 'src/core/directives/set-src/set-src.directive';
import { PlayerStateService } from 'src/core/services/player/player-state.service';

@Component({
  imports: [SetSrcDirective],
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss',
})
export class BlankComponent {
  private readonly playerState = inject(PlayerStateService);
  private readonly svgService = inject(SvgService);

  readonly blankType = input.required<BlankType>();
  readonly src = computed(() => this.getSrc());
  readonly showBlank = computed(() => !this.playerState.dataJson());

  private getSrc(): string {
    switch (this.blankType()) {
      case BlankType.Image:
        return this.svgService.blankImageSvgUrl;
      case BlankType.Video:
        return this.svgService.blankVideoSvgUrl;
      default:
        return '';
    }
  }
}
