import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { PopupBase } from '../../core/components/popup/popup';
import {
  MbscPopupButton,
  MbscPopupCloseEvent,
  MbscPopupDisplay,
  MbscPopupOpenEvent,
  MbscPopupPositionEvent,
} from '../../core/components/popup/popup.types.public';
import { getDocument } from '../../core/util/dom';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mbsc-popup',
  styleUrls: ['../../core/base.scss', '../../core/components/popup/popup.scss', '../../core/components/notifications/notifications.scss'],
  template: `
    <ng-template #ngcontent>
      <ng-container *mbscIf="_isVisible || !_isModal">
        <ng-content></ng-content>
      </ng-container>
    </ng-template>
    <ng-container *mbscIf="_isModal && _isVisible">
      <div
        [class]="
          'mbsc-font mbsc-flex mbsc-popup-wrapper mbsc-popup-wrapper-' +
          s.display +
          _theme +
          _rtl +
          ' ' +
          _className +
          (s.fullScreen ? ' mbsc-popup-wrapper-' + s.display + '-full' : '') +
          (_touchUi ? '' : ' mbsc-popup-pointer') +
          (_round ? ' mbsc-popup-round' : '') +
          (_hasContext ? ' mbsc-popup-wrapper-ctx' : '') +
          (state.isReady ? '' : ' mbsc-popup-hidden')
        "
        (keydown)="_onKeyDown($event)"
        #wrapper
      >
        <div
          *mbscIf="s.showOverlay"
          (click)="_onOverlayClick()"
          [class]="
            'mbsc-popup-overlay mbsc-popup-overlay-' +
            s.display +
            _theme +
            (_isClosing ? ' mbsc-popup-overlay-out' : '') +
            (_isOpening && state.isReady ? ' mbsc-popup-overlay-in' : '')
          "
        ></div>
        <div #limit [class]="'mbsc-popup-limits mbsc-popup-limits-' + s.display" [ngStyle]="_limits"></div>
        <div
          #popup
          [attr.aria-label]="ariaLabel"
          [class]="
            'mbsc-flex-col mbsc-popup mbsc-popup-' +
            s.display +
            (s.fullScreen ? '-full' : '') +
            _theme +
            _hb +
            (state.bubblePos && state.showArrow && s.display === 'anchored' ? ' mbsc-popup-anchored-' + state.bubblePos : '') +
            (_isClosing ? ' mbsc-popup-' + _animation + '-out' : '') +
            (_isOpening && state.isReady ? ' mbsc-popup-' + _animation + '-in' : '')
          "
          [ngStyle]="_style"
          (animationend)="_onAnimationEnd($event)"
          (click)="_onPopupClick()"
          role="dialog"
          aria-modal="true"
        >
          <div
            *mbscIf="s.display === 'anchored' && state.showArrow"
            [class]="'mbsc-popup-arrow-wrapper mbsc-popup-arrow-wrapper-' + state.bubblePos + _theme"
          >
            <div [class]="'mbsc-popup-arrow mbsc-popup-arrow-' + state.bubblePos + _theme" [ngStyle]="state.arrowPos!"></div>
          </div>
          <div class="mbsc-popup-focus" tabindex="-1" #active></div>
          <div
            [class]="
              'mbsc-flex-col mbsc-flex-1-1 mbsc-popup-body mbsc-popup-body-' +
              s.display +
              this._theme +
              this._hb +
              (s.fullScreen ? ' mbsc-popup-body-' + s.display + '-full' : '') +
              (_round ? ' mbsc-popup-body-round' : '')
            "
          >
            <div
              *mbscIf="headerTemplate || s.headerText"
              [class]="
                'mbsc-flex-none mbsc-popup-header mbsc-popup-header-' +
                s.display +
                _theme +
                _hb +
                (_buttons ? '' : ' mbsc-popup-header-no-buttons')
              "
            >
              <ng-template *mbscIf="headerTemplate" [ngTemplateOutlet]="headerTemplate"></ng-template>
              <ng-template *mbscIf="!headerTemplate">
                {{ s.headerText }}
              </ng-template>
            </div>

            <div #content [class]="'mbsc-flex-1-1 mbsc-popup-content' + (s.contentPadding ? ' mbsc-popup-padding' : '') + _theme">
              <ng-container [ngTemplateOutlet]="ngcontent"></ng-container>
            </div>
            <div
              *mbscIf="_buttons"
              [class]="
                'mbsc-flex-none mbsc-popup-buttons mbsc-popup-buttons-' +
                s.display +
                _theme +
                _rtl +
                _hb +
                (_flexButtons ? ' mbsc-flex' : '') +
                (s.fullScreen ? ' mbsc-popup-buttons-' + s.display + '-full' : '')
              "
            >
              <mbsc-button
                *mbscFor="let btn of _buttons"
                [color]="btn.color"
                [class]="
                  'mbsc-popup-button mbsc-popup-button-' +
                  s.display +
                  _rtl +
                  _hb +
                  (_flexButtons ? ' mbsc-popup-button-flex' : '') +
                  ' ' +
                  (btn.cssClass || '')
                "
                [disabled]="btn.disabled"
                [icon]="btn.icon"
                [theme]="s.theme"
                [themeVariant]="s.themeVariant"
                [variant]="btn.variant || s.buttonVariant"
                (click)="!btn.disabled && btn.handler($event)"
              >
                {{ btn.text }}
              </mbsc-button>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-container *mbscIf="!_isModal" [ngTemplateOutlet]="ngcontent"></ng-container>
  `,
})
export class MbscPopup extends PopupBase {
  @ViewChild('active', { static: false } as any)
  public vActive!: ElementRef;

  @ViewChild('content', { static: false } as any)
  public vContent!: ElementRef;

  @ViewChild('limit', { static: false } as any)
  public vLimit!: ElementRef;

  @ViewChild('wrapper', { static: false } as any)
  public vWrapper!: ElementRef;

  @ViewChild('popup', { static: false } as any)
  public vPopup!: ElementRef;

  @Input()
  public activeElm: any; // Needs to be any for SSR

  @Input()
  public anchor: any; // Needs to be any for SSR

  @Input()
  public anchorAlign?: 'start' | 'end' | 'center';

  @Input()
  public animation?: 'pop' | 'slide-down' | 'slide-up' | boolean;

  @Input()
  public ariaLabel?: string;

  @Input()
  public buttons?: Array<MbscPopupButton | 'ok' | 'close' | 'set' | 'cancel'>;

  @Input()
  public buttonVariant?: 'standard' | 'flat' | 'outline';

  @Input()
  public closeOnEsc?: boolean;

  @Input()
  public closeOnOverlayClick?: boolean;

  @Input()
  public closeOnScroll?: boolean;

  @Input()
  public contentPadding?: boolean;

  @Input()
  public cssClass?: string;

  @Input()
  public disableLeftRight?: boolean;

  @Input()
  public display?: MbscPopupDisplay;

  @Input()
  public focusElm?: any;

  @Input()
  public focusOnClose?: boolean;

  @Input()
  public focusOnOpen?: boolean;

  @Input()
  public focusTrap?: boolean;

  @Input()
  public fullScreen?: boolean;

  /**
   * Template reference for custom popup header rendering.
   * Takes priority over the [headerText](#opt-headerText) option.
   *
   * @defaultValue undefined
   *
   * @group Renderers
   * @version 6.1.0
   */
  @Input()
  public headerTemplate?: TemplateRef<any>;

  @Input()
  public headerText?: string;

  @Input()
  public height?: string | number;

  @Input()
  public isOpen?: boolean;

  @Input()
  public maxHeight?: string | number;

  @Input()
  public maxWidth?: string | number;

  @Input()
  public scrollLock?: boolean;

  @Input()
  public setActive?: boolean;

  @Input()
  public showArrow?: boolean;

  @Input()
  public showOverlay?: boolean;

  @Input()
  public windowWidth?: number;

  @Input()
  public width?: string | number;

  // Localization

  @Input()
  public cancelText?: string;

  @Input()
  public closeText?: string;

  @Input()
  public okText?: string;

  @Input()
  public setText?: string;

  // Events

  @Output()
  public onButtonClick: EventEmitter<any> = new EventEmitter();

  @Output()
  public onOverlayClick: EventEmitter<any> = new EventEmitter();

  @Output()
  public onClose: EventEmitter<MbscPopupCloseEvent> = new EventEmitter();

  @Output()
  public onClosed: EventEmitter<any> = new EventEmitter();

  @Output()
  public onKeyDown: EventEmitter<any> = new EventEmitter();

  @Output()
  public onOpen: EventEmitter<MbscPopupOpenEvent> = new EventEmitter();

  @Output()
  public onPosition: EventEmitter<MbscPopupPositionEvent> = new EventEmitter();

  @Output()
  public onResize: EventEmitter<any> = new EventEmitter();

  /** Placeholder comment node */
  private _ph: any;

  protected _updated() {
    const justOpened = this._justOpened;
    if (justOpened) {
      this._active = this.vActive.nativeElement;
      this._content = this.vContent.nativeElement;
      this._limitator = this.vLimit.nativeElement;
      this._wrapper = this.vWrapper.nativeElement;
      this._popup = this.vPopup.nativeElement;
    }
    super._updated();
    if (justOpened && this._ctx && !this._ph) {
      const wrapper = this._wrapper;
      const doc = getDocument(wrapper);
      // Create a comment node to remember the place of the markup
      this._ph = doc!.createComment('mbsc-popup');
      wrapper.parentNode!.insertBefore(this._ph, wrapper);
      this._ctx.appendChild(wrapper);
    }
  }

  protected _onClosed() {
    // Put the markup back to it's original place
    this._ph.parentNode.replaceChild(this._wrapper, this._ph);
    this._ph = null;
    super._onClosed();
  }
}
