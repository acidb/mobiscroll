/** @jsxRuntime classic */
/** @jsx createElement */
import { Button } from '@framework/components/button';
import { createElement } from '@framework/renderer';
import { RadioContext } from '../../shared/radio-context';
import { noop } from '../../util/misc';
import { MbscSegmentedState, SegmentedBase } from './segmented-item';
import { MbscSegmentedGroupOptions, MbscSegmentedOptions } from './segmented.types.public';

import './segmented.scss';

export function template(
  s: MbscSegmentedOptions,
  state: MbscSegmentedState,
  inst: SegmentedBase,
  content: any,
  groupOpt: MbscSegmentedGroupOptions,
): any {
  // With preact it does not compile if jsx <RadioContext.Consumer> is used,
  // so we're using the createElement function
  inst._groupOptions(groupOpt);
  return (
    <label className={inst._cssClass}>
      <input
        ref={inst._setEl}
        aria-labelledby={inst._id}
        checked={inst._checked}
        className={'mbsc-segmented-input mbsc-reset ' + (s.inputClass || '') + inst._theme + (inst._checked ? ' mbsc-selected' : '')}
        disabled={inst._disabled}
        name={inst._isMultiple ? s.name : inst._name}
        onChange={noop}
        type={inst._isMultiple ? 'checkbox' : 'radio'}
        value={inst._value}
      />
      <div
        ref={inst._setBox}
        className={
          'mbsc-segmented-selectbox' +
          inst._theme +
          (inst._animate ? ' mbsc-segmented-selectbox-animate' : '') +
          (inst._checked ? ' mbsc-selected' : '')
        }
      >
        <div
          className={
            'mbsc-segmented-selectbox-inner' +
            inst._theme +
            (inst._index === inst._selectedIndex || inst._checked ? ' mbsc-segmented-selectbox-inner-visible' : '') +
            (inst._checked ? ' mbsc-selected' : '')
          }
        />
      </div>
      <Button
        aria-hidden={true}
        ariaLabel={s.ariaLabel}
        className={'mbsc-segmented-button' + (inst._checked ? ' mbsc-selected' : '') + (state.hasFocus ? ' mbsc-focus' : '')}
        color={inst._color}
        disabled={inst._disabled}
        endIcon={s.endIcon}
        endIconSrc={s.endIconSrc}
        endIconSvg={s.endIconSvg}
        hidden={true}
        icon={s.icon}
        iconSrc={s.iconSrc}
        iconSvg={s.iconSvg}
        id={inst._id}
        ripple={s.ripple}
        rtl={s.rtl}
        startIcon={s.startIcon}
        startIconSrc={s.startIconSrc}
        startIconSvg={s.startIconSvg}
        tag="span"
        theme={s.theme}
        themeVariant={s.themeVariant}
      >
        {content}
      </Button>
    </label>
  );
}

export class Segmented extends SegmentedBase {
  public get checked(): boolean {
    return this._checked;
  }
  public set checked(value: boolean) {
    this._toggle(value);
  }

  protected _template(s: MbscSegmentedOptions, state: MbscSegmentedState) {
    return createElement(RadioContext.Consumer, null, ((groupOpt: MbscSegmentedGroupOptions) =>
      template(s, state, this, s.children, groupOpt)) as any);
  }
}

// Accidentally in 5.0.0-beta we named this SegmentedItem, while in v4 and other frameworks in v5 it simply remained Segmented.
// To remain consistent, I named it back to Segmented, but here's an alias as well so we don't break it for people using the beta.
/** @hidden */
export const SegmentedItem = Segmented;
