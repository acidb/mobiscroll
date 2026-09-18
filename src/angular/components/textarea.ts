import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MbscInput } from './input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-textarea',
  styleUrls: ['../../core/base.scss', '../../core/shared/form-controls/form-controls.scss', '../../core/components/input/input.scss'],
  template: `
    <label [for]="_id" [class]="_labelClass">
      {{ s.label }}
      <ng-content select="[mbsc-label]"></ng-content>
    </label>
    <span [class]="_innerClass">
      <textarea
        #input
        [(ngModel)]="value"
        (blur)="_onFormTouch($event)"
        [attr.accept]="accept"
        [attr.autocapitalize]="autocapitalize"
        [attr.autocomplete]="autocomplete"
        [attr.autocorrect]="autocorrect"
        [attr.autofocus]="autofocus"
        [attr.maxlength]="maxlength"
        [attr.minlength]="minlength"
        [attr.name]="name"
        [attr.pattern]="pattern"
        [attr.required]="required"
        [attr.rows]="rows"
        [attr.spellcheck]="spellcheck"
        [class]="_nativeElmClass"
        [disabled]="_disabled"
        [id]="id || _id"
        [readonly]="readonly"
        [placeholder]="s.placeholder"
      ></textarea>
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
export class MbscTextarea extends MbscInput {
  protected static _name = 'Textarea';
  public _tag = 'textarea';
}
