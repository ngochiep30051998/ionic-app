import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { IError } from '../interfaces/errors.interfaces';

@Directive({
  selector: '[appError]'
})
export class ErrorDirective implements OnChanges {
  @Input() productId: string;
  @Input() errors: IError[] = [];
  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnChanges(): void {
    const err: IError = this.errors.find(x => x.id === this.productId);
    const childElements = this.el.nativeElement.children;
      for (const child of childElements) {
        this.renderer.removeChild(this.el.nativeElement, child);
      }
    if (err) {
      const p = this.renderer.createElement('p');
      const text = this.renderer.createText(err.message);
      this.renderer.appendChild(p, text);
      this.renderer.addClass(p, 'error-text');
      this.renderer.appendChild(this.el.nativeElement, p);
    }
  }
}
