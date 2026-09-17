import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { isString, UNDEFINED } from '../../util/misc';

export interface MbscIconOptions {
  class?: string;
  className?: string;
  name?: string;
  svg?: string;
  theme?: string;
  onClick?: any;
}

/** @hidden */
@Directive({ selector: '[mbsc-i-b]' })
export class IconBase extends BaseComponent<MbscIconOptions, any> {
  public _cssClass?: string;
  public _hasChildren?: boolean;

  public _svg: any;

  protected _render(s: MbscIconOptions) {
    // The icon might be custom markup as well
    this._hasChildren = s.name !== UNDEFINED && !isString(s.name);
    this._cssClass =
      this._className +
      ' mbsc-icon' +
      this._theme +
      (s.name && !this._hasChildren
        ? // If the icon name contains a space, we consider it as a 3rd party font icon,
          // (e.g. FA: 'fas fa-camera', or IonIcon: 'icon ion-md-heart').
          // Otherwise we add the 'mbsc-icon-' prefix to use our font.
          s.name.indexOf(' ') !== -1
          ? ' ' + s.name
          : ' mbsc-font-icon mbsc-icon-' + s.name
        : '');
    this._svg = s.svg ? this._safeHtml(s.svg) : UNDEFINED;
  }
}
