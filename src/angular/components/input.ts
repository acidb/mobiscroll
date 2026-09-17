import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { InputBase } from '../../core/components/input/input';
import { trigger } from '../../core/util/dom';
import { FormControl } from '../form-control';

let guid = 0;

@FormControl
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_cssClass',
  },
  selector: 'mbsc-input',
  styleUrls: ['../../core/base.scss', '../../core/shared/form-controls/form-controls.scss', '../../core/components/input/input.scss'],
  template: `
    <label #lbl [for]="_id" [class]="_labelClass">
      {{ s.label }}
      <ng-content select="[mbsc-label]"></ng-content>
    </label>
    <span [class]="_innerClass" (click)="_triggerEvent($event)" (keydown)="_triggerEvent($event)">
      <input
        #input
        [(ngModel)]="value"
        (blur)="_onFormTouch($event)"
        [attr.accept]="accept"
        [attr.aria-expanded]="ariaExpanded"
        [attr.aria-haspopup]="ariaHaspopup"
        [attr.aria-label]="ariaLabel"
        [attr.autocapitalize]="autocapitalize"
        [attr.autocomplete]="autocomplete"
        [attr.autocorrect]="autocorrect"
        [attr.autofocus]="autofocus"
        [attr.max]="max"
        [attr.maxlength]="maxlength"
        [attr.min]="min"
        [attr.minlength]="minlength"
        [attr.multiple]="multiple"
        [attr.name]="name"
        [attr.pattern]="pattern"
        [attr.required]="required"
        [attr.role]="role"
        [attr.spellcheck]="spellcheck"
        [attr.step]="step"
        [class]="_nativeElmClass + (s.tags ? ' mbsc-textfield-hidden' : '')"
        [disabled]="_disabled"
        [id]="id || _id"
        [placeholder]="s.placeholder"
        [readonly]="readonly"
        [type]="s.passwordToggle ? (_hidePass ? 'password' : 'text') : s.type"
      />
      <input
        *mbscIf="s.type === 'file'"
        [class]="_dummyElmClass"
        [disabled]="_disabled"
        [placeholder]="s.placeholder"
        [readonly]="true"
        type="text"
        [value]="state.files || ''"
      />
      <span *mbscIf="tags" [class]="'mbsc-textfield-tags' + _nativeElmClass">
        <ng-container *mbscFor="let v of _tagsArray; let i = index">
          <span *mbscIf="v" [class]="'mbsc-textfield-tag' + _theme + _rtl">
            <span [class]="'mbsc-textfield-tag-text' + _theme">{{ v }}</span>
            <mbsc-icon class="mbsc-textfield-tag-clear" (click)="_onTagClear($event, i)" [svg]="s.clearIcon" [theme]="s.theme"></mbsc-icon>
          </span>
        </ng-container>
        <span *mbscIf="!_tagsArray!.length" [class]="'mbsc-textfield-tags-placeholder' + _theme">{{ s.placeholder }}</span>
      </span>
      <mbsc-icon *mbscIf="s.dropdown" [class]="_selectIconClass" [svg]="s.dropdownIcon" [theme]="s.theme"></mbsc-icon>
      <mbsc-icon
        *mbscIf="_hasStartIcon"
        [class]="_startIconClass"
        [name]="s.startIcon"
        [svg]="s.startIconSvg"
        [theme]="s.theme"
        (click)="_onIconClick()"
      ></mbsc-icon>
      <mbsc-icon
        *mbscIf="_hasEndIcon && !s.passwordToggle"
        [class]="_endIconClass"
        [name]="s.endIcon"
        [svg]="s.endIconSvg"
        [theme]="s.theme"
        (click)="_onIconClick()"
      >
      </mbsc-icon>
      <mbsc-icon
        *mbscIf="s.passwordToggle"
        (click)="_onClick()"
        [class]="_passIconClass"
        [name]="_hidePass ? s.showIcon : s.hideIcon"
        [svg]="_hidePass ? s.showIconSvg : s.hideIconSvg"
        [theme]="s.theme"
      >
      </mbsc-icon>
      <span *mbscIf="_hasError" [class]="_errorClass">{{ s.errorMessage }}</span>
      <fieldset *mbscIf="s.notch && s.inputStyle === 'outline'" aria-hidden="true" [class]="_fieldSetClass">
        <legend [class]="_legendClass">{{ s.label && s.labelStyle !== 'inline' ? s.label : '&nbsp;' }}</legend>
      </fieldset>
      <span *mbscIf="s.ripple" [class]="_rippleClass"></span>
    </span>
  `,
})
export class MbscInput extends InputBase {
  @ViewChild('input', { static: false } as any)
  public vInput!: ElementRef;

  @ViewChild('lbl', { static: false } as any)
  public vLbl!: ElementRef;

  @Input()
  public ariaExpanded?: boolean;

  @Input()
  public ariaHaspopup?: string;

  @Input()
  public ariaLabel?: string;

  @Input()
  public accept?: string;

  @Input()
  public autocapitalize?: string;

  @Input()
  public autocomplete?: 'on' | 'off';

  @Input()
  public autocorrect?: string;

  @Input()
  public autofocus?: string;

  @Input()
  public disabled?: boolean;

  @Input()
  public dropdown?: boolean;

  @Input()
  public endIcon?: string;

  @Input()
  public endIconSrc?: string;

  @Input()
  public endIconSvg?: string;

  @Input()
  public error?: boolean | null;

  @Input()
  public errorMessage?: string;

  @Input()
  public hideIcon?: string;

  @Input()
  public hideIconSvg?: string;

  @Input()
  public id?: string;

  @Input()
  public inputClass?: string;

  @Input()
  public inputStyle?: 'underline' | 'box' | 'outline';

  @Input()
  public label?: string;

  @Input()
  public labelStyle?: 'stacked' | 'inline' | 'floating';

  @Input()
  public max?: number;

  @Input()
  public maxlength?: number;

  @Input()
  public min?: number;

  @Input()
  public minlength?: number;

  @Input()
  public multiple?: string;

  @Input()
  public name?: string;

  @Input()
  public passwordToggle?: boolean;

  @Input()
  public pattern?: string;

  @Input()
  public pickerMap?: any;

  @Input()
  public pickerValue?: any;

  @Input()
  public placeholder?: string;

  @Input()
  public readonly?: boolean;

  @Input()
  public required?: string;

  @Input()
  public ripple?: boolean;

  @Input()
  public role?: string;

  @Input()
  public rows?: number;

  @Input()
  public showIcon?: string;

  @Input()
  public showIconSvg?: string;

  @Input()
  public spellcheck?: string;

  @Input()
  public startIcon?: string;

  @Input()
  public startIconSrc?: string;

  @Input()
  public startIconSvg?: string;

  @Input()
  public step?: number;

  @Input()
  public tags?: boolean;

  @Input()
  public type?: string;

  @Output()
  public onChange: EventEmitter<any> = new EventEmitter();

  public _id = 'mbsc-textfield-' + guid++;

  public _onIconClick() {
    // Forward icon click to the label to have similar behavior with other frameworks
    this.vLbl.nativeElement.click();
  }

  public _triggerEvent(ev: any) {
    if (this.s.tags && ev.target !== this._el) {
      trigger(this._el, ev.type);
    }
  }

  protected _onValueChange() {
    this._checkFloating();
  }

  protected _mounted() {
    this._el = this.vInput.nativeElement;
    super._mounted();
  }
}
