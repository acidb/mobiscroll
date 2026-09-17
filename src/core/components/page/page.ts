import { Directive } from '@angular/core';
import { BaseComponent } from '../../base';
import { MbscPageOptions } from './page.types.public';

/** @hidden */
@Directive({ selector: '[mbsc-page-b]' })
export class PageBase extends BaseComponent<MbscPageOptions, any> {
  /** @hidden */
  public static defaults: MbscPageOptions = {};

  protected static _name = 'Page';

  public _cssClass?: string;

  protected _render(s: MbscPageOptions) {
    this._cssClass = `mbsc-page mbsc-font ${this._className}${this._theme}${this._rtl}`;
  }
}
