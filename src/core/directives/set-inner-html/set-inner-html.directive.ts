import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[setInnerHtml]',
})
export class SetInnerHtmlDirective {
  private readonly el = inject(ElementRef);
  readonly setInnerHtml = input.required<string>();

  constructor() {
    effect(() => {
      const element = this.el.nativeElement as HTMLElement;
      element.innerHTML = this.setInnerHtml();
    });
  }
}
