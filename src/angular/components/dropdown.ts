import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MbscInput } from './input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-dropdown',
  styleUrls: ['../../core/base.scss', '../../core/shared/form-controls/form-controls.scss', '../../core/components/input/input.scss'],
  template: `
    <label [for]="_id" [class]="_labelClass">
      {{ s.label }}
      <ng-content select="[mbsc-label]"></ng-content>
    </label>
    <span [class]="_innerClass">
      <select
        #input
        (blur)="_onFormTouch($event)"
        (change)="value = input.value"
        [attr.autofocus]="autofocus"
        [attr.multiple]="multiple"
        [attr.name]="name"
        [attr.required]="required"
        [class]="'mbsc-select ' + _nativeElmClass"
        [disabled]="_disabled"
        [id]="id || _id"
        [value]="value"
      >
        <ng-content></ng-content>
      </select>
      <mbsc-icon [class]="_selectIconClass" [svg]="s.dropdownIcon" [theme]="s.theme"></mbsc-icon>
      <mbsc-icon
        *mbscIf="_hasStartIcon"
        [class]="_startIconClass"
        [name]="s.startIcon"
        [svg]="s.startIconSvg"
        [theme]="s.theme"
        (click)="_onIconClick()"
      ></mbsc-icon>
      <mbsc-icon
        *mbscIf="_hasEndIcon"
        [class]="_endIconClass"
        [name]="s.endIcon"
        [svg]="s.endIconSvg"
        [theme]="s.theme"
        (click)="_onIconClick()"
      ></mbsc-icon>
      <span *mbscIf="_hasError" [class]="_errorClass">{{ s.errorMessage }}</span>
      <fieldset *mbscIf="s.notch && s.inputStyle === 'outline'" aria-hidden="true" [class]="_fieldSetClass">
        <legend [class]="_legendClass">{{ s.label && s.labelStyle !== 'inline' ? s.label : '&nbsp;' }}</legend>
      </fieldset>
      <span *mbscIf="s.ripple && s.inputStyle !== 'outline'" [class]="_rippleClass"></span>
    </span>
  `,
})
export class MbscDropdown extends MbscInput {
  protected static _name = 'Dropdown';
  public _tag = 'select';
}
