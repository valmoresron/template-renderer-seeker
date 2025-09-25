import { Component, effect, inject, signal } from '@angular/core';
import { PlayerStateService } from '../core/services/player/player-state.service';
import { UnsupportedResolutionComponent } from './pages/unsupported-resolution/unsupported-resolution.component';
import { PlayerComponent } from './pages/player/player.component';
import { ResolutionService } from 'src/core/services/resolution/resolution.service';

@Component({
  imports: [PlayerComponent, UnsupportedResolutionComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly playerState = inject(PlayerStateService);
  private readonly resolutionService = inject(ResolutionService);

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
  }
}
