/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement, isVue } from '@framework/renderer';
import { UNDEFINED } from '../../util/misc';
import { IconBase, MbscIconOptions } from './icon';

import './icon.scss';

export function template(s: MbscIconOptions, inst: IconBase): any {
  // Both v-html and children on the same element results in error with Vue SSR
  return inst._hasChildren ? (
    <span onClick={s.onClick} className={inst._cssClass}>
      {s.name}
    </span>
  ) : (
    <span
      onClick={s.onClick}
      className={inst._cssClass}
      dangerouslySetInnerHTML={isVue ? UNDEFINED : inst._svg}
      v-html={isVue ? inst._svg : UNDEFINED}
    />
  );
}

/**
 * The Icon component.
 *
 * Usage:
 *
 * ```
 * <Icon name="home" />
 * ```
 */
export class Icon extends IconBase {
  protected _template(s: MbscIconOptions): any {
    return template(s, this);
  }
}
