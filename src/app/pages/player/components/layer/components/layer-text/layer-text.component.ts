import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ILayerComponent } from '../../models/layer-component.model';
import { TextLayer } from 'src/core/models/renderer/slide/layer/text-layer.model';
import { PlayerService } from 'src/core/services/player/player.service';
import { LayerService } from 'src/core/services/layer/layer.service';
import { SetInnerHtmlDirective } from 'src/core/directives/set-inner-html/set-inner-html.directive';

@Component({
  imports: [SetInnerHtmlDirective],
  selector: 'app-layer-text',
  templateUrl: './layer-text.component.html',
  styleUrl: './layer-text.component.scss',
})
export class LayerTextComponent implements ILayerComponent {
  private readonly playerService = inject(PlayerService);
  private readonly layerService = inject(LayerService);

  readonly element = viewChild<ElementRef<HTMLDivElement>>('element');
  readonly layer = input.required<TextLayer>();

  readonly textValue = computed(() =>
    this.playerService.getTextValueByLayer(this.layer()),
  );

  constructor() {
    const initRef = effect(() => {
      if (this.layer() && this.element()) {
        this.layerService.setTextStyle(
          this.layer(),
          this.element()?.nativeElement!,
        );
        initRef.destroy();
      }
    });
  }
}
