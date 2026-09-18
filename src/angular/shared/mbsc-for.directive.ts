import { Directive, DoCheck, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface MbscForContext<T> {
  $implicit: T;
  mbscForOf: T[];
  index: number;
  count: number;
  first: boolean;
  last: boolean;
  even: boolean;
  odd: boolean;
}

@Directive({
  selector: '[mbscFor][mbscForOf]',
})
export class MbscForDirective<T = any> implements DoCheck {
  private _mbscForOf: T[] = [];
  private _viewsByKey = new Map<any, any>(); // Map<trackKey, EmbeddedViewRef>
  private _trackByFn: ((index: number, item: T) => any) | null = null;
  private _dirty = false;

  constructor(private _viewContainerRef: ViewContainerRef, private _templateRef: TemplateRef<MbscForContext<T>>) {}

  @Input()
  public set mbscForOf(iterable: Iterable<T> | null | undefined) {
    this._mbscForOf = iterable ? Array.from(iterable) : [];
    this._dirty = true;
  }

  // Supports `*mbscFor="let item of items; trackBy: trackFn"` syntax.
  // Angular will bind `trackBy:` to a property named `${directiveName}TrackBy`.
  // So for `mbscFor` the expected input is `mbscForTrackBy`.
  @Input()
  public set mbscForTrackBy(fn: ((index: number, item: T) => any) | null | undefined) {
    // Avoid `??` for older TypeScript versions used by angular-legacy builds.
    this._trackByFn = fn !== null && fn !== undefined ? fn : null;
    this._dirty = true;
  }

  // Render in `ngDoCheck` (like Angular's own NgForOf) instead of inside the
  // `mbscForOf` setter. Angular assigns `[mbscForOf]` before `[mbscForTrackBy]`,
  // so rendering from the setter could run before `trackBy` was applied, keying
  // views by index on the first render and by the real key afterwards — which
  // forced a full destroy/recreate of every view (and its DOM) on the next
  // render. Deferring to `ngDoCheck` guarantees `trackBy` is always set first.
  public ngDoCheck() {
    if (this._dirty) {
      this._dirty = false;
      this._render();
    }
  }

  private _getKey(index: number, item: T): any {
    // When no trackBy is provided, fall back to index so that arrays with
    // duplicate or undefined values (e.g. ARRAY7) are tracked correctly.
    return this._trackByFn ? this._trackByFn(index, item) : index;
  }

  private _render() {
    const count = this._mbscForOf.length;

    const nextViewsByKey = new Map<any, any>();

    // Create/update/reorder views in the new array order.
    this._mbscForOf.forEach((item, index) => {
      const key = this._getKey(index, item);
      const existingView = this._viewsByKey.get(key);

      const context: MbscForContext<T> = {
        $implicit: item,
        count,
        even: index % 2 === 0,
        first: index === 0,
        index,
        last: index === count - 1,
        mbscForOf: this._mbscForOf,
        odd: index % 2 === 1,
      };

      if (existingView) {
        // Update in-place so template state can be preserved.
        Object.assign(existingView.context, context);
        // Reorder if needed.
        const currentIndex = this._viewContainerRef.indexOf(existingView);
        if (currentIndex !== index && currentIndex !== -1) {
          this._viewContainerRef.move(existingView, index);
        }
        nextViewsByKey.set(key, existingView);
      } else {
        const view = this._viewContainerRef.createEmbeddedView(this._templateRef, context, index);
        nextViewsByKey.set(key, view);
      }
    });

    // Remove views whose keys are no longer present.
    // Uses _viewsByKey directly to avoid ViewEngine reference-equality issues
    // with ViewContainerRef.get(i) returning a different wrapper than createEmbeddedView.
    this._viewsByKey.forEach((view, key) => {
      if (!nextViewsByKey.has(key)) {
        const idx = this._viewContainerRef.indexOf(view);
        if (idx !== -1) {
          this._viewContainerRef.remove(idx);
        }
      }
    });

    this._viewsByKey = nextViewsByKey;
  }
}
