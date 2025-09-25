import { Component, computed, DestroyRef, effect, inject } from '@angular/core';
import { LegacyService } from 'src/core/services/legacy/legacy.service';
import { PlayerStateService } from 'src/core/services/player/player-state.service';
import { ResolutionService } from 'src/core/services/resolution/resolution.service';

@Component({
  imports: [],
  selector: 'app-unsupported-resolution',
  templateUrl: './unsupported-resolution.component.html',
  styleUrl: './unsupported-resolution.component.scss',
})
export class UnsupportedResolutionComponent {
  private readonly resolution = inject(ResolutionService).resolution;

  readonly message = computed(() => {
    const { width, height } = this.resolution();
    return `Unsupported resolution: ${width}x${height}`;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    const legacyService = inject(LegacyService);
    const playerState = inject(PlayerStateService);

    const ref = effect(() => {
      setTimeout(() => ref.destroy());

      const hasDataJson = Boolean(playerState.dataJson());
      (async () => {
        while (!destroyRef.destroyed) {
          legacyService.logInitMessage(hasDataJson);

          await new Promise((resolve) => setTimeout(resolve, 5000));

          if (!destroyRef.destroyed) {
            legacyService.logEndSlideMessage();
            legacyService.logEndTemplateMessage();
          }
        }
      })();
    });
  }
}
