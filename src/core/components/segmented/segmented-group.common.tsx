/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement } from '@framework/renderer';
import { RadioContext } from '../../shared/radio-context';
import { SegmentedGroupBase } from './segmented-group';
import { MbscSegmentedGroupOptions } from './segmented.types.public';

export function template(s: MbscSegmentedGroupOptions, inst: SegmentedGroupBase, content: any): any {
  return (
    <div className={inst._groupClass} ref={inst._setEl}>
      {content}
    </div>
  );
}

/**
 * The SegmentedGroup.
 *
 * Usage:
 *
 * ```
 * <SegmentedGroup>...</SegmentedGroup>
 * ```
 */

export class SegmentedGroup extends SegmentedGroupBase {
  protected _template(s: MbscSegmentedGroupOptions): any {
    // With preact it does not compile if jsx <RadioContext.Provider> is used,
    // so we're using the createElement function
    return createElement(RadioContext.Provider, { children: template(s, this, s.children), value: this._groupOpt });
  }
}
