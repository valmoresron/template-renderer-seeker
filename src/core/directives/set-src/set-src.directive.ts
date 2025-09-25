import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[setSrc]',
})
export class SetSrcDirective {
  private readonly el = inject(ElementRef);
  readonly setSrc = input.required<string>();

  constructor() {
    effect(() => {
      const element = this.el.nativeElement as
        | HTMLVideoElement
        | HTMLImageElement;
      element.setAttribute('src', this.setSrc());
    });
  }
}
