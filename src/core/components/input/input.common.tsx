/** @jsxRuntime classic */
/** @jsx createElement */
import { Icon } from '@framework/components/icon';
import { createElement, isPreact, isVue, ON_MOUSE_DOWN } from '@framework/renderer';
import { UNDEFINED } from '../../util/misc';
import { InputBase, MbscInputState } from './input';
import { MbscInputOptions } from './input.types.public';

import '../../shared/form-controls/form-controls.scss';
import './input.scss';

export function template(s: MbscInputOptions, state: MbscInputState, inst: InputBase, content: any, attrs?: any) {
  const {
    children,
    dropdown,
    dropdownIcon,
    endIcon,
    endIconSrc,
    endIconSvg,
    error,
    errorMessage,
    hasChildren,
    hideIcon,
    hideIconSvg,
    inputClass,
    inputStyle,
    label,
    labelStyle,
    modelValue,
    notch,
    passwordToggle,
    pickerMap,
    pickerValue,
    ripple,
    rows,
    rtl,
    showIcon,
    showIconSvg,
    startIcon,
    startIconSrc,
    startIconSvg,
    tags,
    theme,
    themeVariant,
    type,
    ...rest
  } = inst.props;
  // Need to use props here, otherwise all inherited settings will be included in ...other,
  // which will end up on the native element, resulting in invalid DOM
  const lbl = s.label;
  const mousedown = { [ON_MOUSE_DOWN]: inst._onMouseDown };
  // For Vue we need to add $attrs as well for fallthrough listeners to work
  const other = isVue ? { ...rest, ...attrs } : rest;

  // Vue.js doesn't pass value in the ...other
  if (isVue && s.modelValue !== UNDEFINED) {
    other.value = inst._value;
  }

  // In case of Preact the textarea initial value only works correctly if it's written as a child
  if (isPreact && inst._tag === 'textarea') {
    delete other.defaultValue;
    delete other.value;
  }

  return (
    <label className={inst._cssClass} {...mousedown}>
      {(lbl || hasChildren) && <span className={inst._labelClass}>{hasChildren ? '' : lbl}</span>}
      <span className={inst._innerClass}>
        {inst._tag === 'input' && (
          <input
            {...other}
            ref={inst._setEl}
            className={inst._nativeElmClass + (s.tags ? ' mbsc-textfield-hidden' : '')}
            disabled={inst._disabled}
            type={s.passwordToggle ? (inst._hidePass ? 'password' : 'text') : type}
          />
        )}
        {type === 'file' && (
          <input
            className={inst._dummyElmClass}
            disabled={inst._disabled}
            placeholder={s.placeholder}
            readOnly={true}
            type="text"
            value={state.files || ''}
          />
        )}
        {inst._tag === 'select' && (
          <select {...other} ref={inst._setEl} className={'mbsc-select' + inst._nativeElmClass} disabled={inst._disabled}>
            {content}
          </select>
        )}
        {inst._tag === 'textarea' && (
          <textarea {...other} ref={inst._setEl} className={inst._nativeElmClass} disabled={inst._disabled}>
            {isPreact ? inst._value : UNDEFINED}
          </textarea>
        )}

        {tags && (
          <span className={'mbsc-textfield-tags' + inst._nativeElmClass}>
            {inst._tagsArray!.length ? (
              inst._tagsArray!.map(
                (v, i) =>
                  v && (
                    <span key={i} className={'mbsc-textfield-tag' + inst._theme + inst._rtl}>
                      <span className={'mbsc-textfield-tag-text' + inst._theme}>{v}</span>
                      <Icon
                        className="mbsc-textfield-tag-clear"
                        onClick={(ev: any) => inst._onTagClear(ev, i)}
                        svg={s.clearIcon}
                        theme={s.theme}
                      />
                    </span>
                  ),
              )
            ) : (
              <span className={'mbsc-textfield-tags-placeholder' + inst._theme}>{s.placeholder}</span>
            )}
          </span>
        )}

        {(inst._tag === 'select' || dropdown) && <Icon className={inst._selectIconClass} svg={s.dropdownIcon} theme={s.theme} />}
        {inst._hasStartIcon && <Icon className={inst._startIconClass} name={s.startIcon} svg={s.startIconSvg} theme={s.theme} />}
        {inst._hasEndIcon && !s.passwordToggle && (
          <Icon className={inst._endIconClass} name={s.endIcon} svg={s.endIconSvg} theme={s.theme} />
        )}
        {s.passwordToggle && (
          <Icon
            onClick={inst._onClick}
            className={inst._passIconClass}
            name={inst._hidePass ? s.showIcon : s.hideIcon}
            svg={inst._hidePass ? s.showIconSvg : s.hideIconSvg}
            theme={s.theme}
          />
        )}
        {inst._hasError && <span className={inst._errorClass}>{errorMessage}</span>}
        {s.notch && s.inputStyle === 'outline' && (
          <fieldset aria-hidden="true" className={inst._fieldSetClass}>
            <legend className={inst._legendClass}>{lbl && s.labelStyle !== 'inline' ? lbl : '&nbsp;'}</legend>
          </fieldset>
        )}
        {s.ripple && <span className={inst._rippleClass} />}
      </span>
    </label>
  );
}

export class Input extends InputBase {
  public get value(): boolean {
    return this._el && (this._el as any).value;
  }
  public set value(value: boolean) {
    (this._el as any).value = value;
    this._checkFloating();
    if (this._tag === 'textarea') {
      this._sizeTextArea();
    }
  }

  protected _template(s: MbscInputOptions, state: MbscInputState): any {
    return template(s, state, this, s.children);
  }
}
