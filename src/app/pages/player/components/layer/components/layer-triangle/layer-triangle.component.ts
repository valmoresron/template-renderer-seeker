import { Component, ElementRef, viewChild } from '@angular/core';
import { ILayerComponent } from '../../models/layer-component.model';

@Component({
  imports: [],
  selector: 'app-layer-triangle',
  templateUrl: './layer-triangle.component.html',
  styleUrl: './layer-triangle.component.scss',
})
export class LayerTriangleComponent implements ILayerComponent {
  readonly element = viewChild<ElementRef<HTMLDivElement>>('element');
}
