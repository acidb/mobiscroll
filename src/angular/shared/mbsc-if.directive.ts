import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[mbscIf]',
})
export class MbscIfDirective {
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  public static ngTemplateGuard_mbscIf: 'binding' = 'binding';

  private _context = new MbscIfContext();
  private _viewRef: any = null;

  constructor(private _templateRef: TemplateRef<MbscIfContext>, private _viewContainerRef: ViewContainerRef) {}

  @Input()
  public set mbscIf(condition: any) {
    this._context.$implicit = this._context.mbscIf = condition;
    this._updateView();
  }

  private _updateView() {
    if (this._context.$implicit) {
      if (!this._viewRef) {
        this._viewContainerRef.clear();
        this._viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, this._context);
      }
    } else if (this._viewRef) {
      this._viewContainerRef.clear();
      this._viewRef = null;
    }
  }
}

class MbscIfContext {
  public $implicit: any = null;
  public mbscIf: any = null;
}
