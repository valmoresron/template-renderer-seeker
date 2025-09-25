import { Component, ElementRef, viewChild } from '@angular/core';
import { ILayerComponent } from '../../models/layer-component.model';

@Component({
  imports: [],
  selector: 'app-layer-rectangle',
  templateUrl: './layer-rectangle.component.html',
  styleUrl: './layer-rectangle.component.scss',
})
export class LayerRectangleComponent implements ILayerComponent {
  readonly element = viewChild<ElementRef<HTMLDivElement>>('element');
}
