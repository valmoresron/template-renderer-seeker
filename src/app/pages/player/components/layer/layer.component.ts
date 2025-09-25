import { Component, inject, input, viewChild } from '@angular/core';
import { Layer } from 'src/core/models/renderer/slide/layer/layer.model';
import { LayerRectangleComponent } from 'src/app/pages/player/components/layer/components/layer-rectangle/layer-rectangle.component';
import { LayerCircleComponent } from './components/layer-circle/layer-circle.component';
import { LayerImageComponent } from './components/layer-image/layer-image.component';
import { LayerTextComponent } from './components/layer-text/layer-text.component';
import { LayerTriangleComponent } from './components/layer-triangle/layer-triangle.component';
import { LayerVideoComponent } from './components/layer-video/layer-video.component';
import { ILayerComponent } from './models/layer-component.model';
import { LayerService } from 'src/core/services/layer/layer.service';

@Component({
  imports: [
    LayerCircleComponent,
    LayerImageComponent,
    LayerRectangleComponent,
    LayerTextComponent,
    LayerTriangleComponent,
    LayerVideoComponent,
  ],
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrl: './layer.component.scss',
})
export class LayerComponent {
  readonly layer = input.required<Layer<unknown>>();
  readonly layerComponent = viewChild<ILayerComponent>('layerComponent');
  readonly castLayer = inject(LayerService).castLayer;
}
