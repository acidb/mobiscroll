/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement } from '@framework/renderer';
import { PageBase } from './page';
import { MbscPageOptions } from './page.types.public';

import '../../base.scss';
import './page.scss';

export function template(s: MbscPageOptions, inst: PageBase, content: any): any {
  return createElement(s.tag || 'div', { className: inst._cssClass, ref: inst._setEl }, content);
}

export class Page extends PageBase {
  protected _template(s: MbscPageOptions): any {
    return template(s, this, s.children);
  }
}
