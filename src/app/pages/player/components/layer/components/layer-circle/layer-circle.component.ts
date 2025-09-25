import { Component, ElementRef, viewChild } from '@angular/core';
import { ILayerComponent } from '../../models/layer-component.model';

@Component({
  selector: 'app-layer-circle',
  imports: [],
  templateUrl: './layer-circle.component.html',
  styleUrl: './layer-circle.component.scss',
})
export class LayerCircleComponent implements ILayerComponent {
  readonly element = viewChild<ElementRef<HTMLDivElement>>('element');
}
