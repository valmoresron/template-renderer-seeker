import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { PlayerStateService } from '../core/services/player/player-state.service';
import { UnsupportedResolutionComponent } from './pages/unsupported-resolution/unsupported-resolution.component';
import { PlayerComponent } from './pages/player/player.component';
import { ResolutionService } from 'src/core/services/resolution/resolution.service';
import { ZoneService } from 'src/core/services/zone/zone.service';

@Component({
  imports: [PlayerComponent, UnsupportedResolutionComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly mainViewport =
    viewChild<ElementRef<HTMLDivElement>>('mainViewport');

  private readonly playerState = inject(PlayerStateService);
  private readonly resolutionService = inject(ResolutionService);
  private readonly zoneService = inject(ZoneService);

  readonly render = signal(true);
  readonly isLoading = this.playerState.loadingData;
  readonly supportedResolutions = this.playerState.supportedResolutions;
  readonly isResolutionSupported = this.playerState.isResolutionSupported;
  readonly builderDataScaled = this.playerState.builderDataScaled;

  constructor() {
    let resChangeCount = 0;
    effect(() => {
      this.resolutionService.resolution();
      resChangeCount++;
      if (resChangeCount > 1) {
        this.render.set(false);
        setTimeout(() => {
          this.render.set(true);
        }, 100);
      }
    });

    effect(() => {
      if (this.mainViewport()?.nativeElement) {
        this.zoneService.mainViewport.set(this.mainViewport()!.nativeElement);
      }
    });
  }
}
