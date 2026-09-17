import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  NgModule,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IModule } from '../core/base';
import { MbscOptions } from '../core/commons';
import { noop } from '../core/util/misc';
import { MBSC_OPTIONS, MbscOptionsService } from './options.service';

export interface IDirectiveType extends Directive {
  standalone?: boolean;
}

export interface INgModuleType extends NgModule {
  entryComponents?: any[];
}

export function updateValue(inst: any, val: any) {
  inst._val = val;
  if (inst._onValueChange) {
    inst._onValueChange(val);
  }
  inst.setState({ value: val });
}

/** @hidden */
// @Injectable Needed for the ChangeDetectorRef to work in subclasses
// See https://github.com/angular/angular/issues/22532
// With Angular Ivy even @Injectable does not solve this, so we need to use @Directive here
// See https://github.com/angular/angular/issues/30080
// This has the side effect that all inherited classes needs to be added to modules as well
@Directive({ selector: '[mbsc-b]' })
export class Base<PropsType extends MbscOptions, StateType>
  implements AfterViewChecked, AfterViewInit, DoCheck, OnChanges, OnDestroy, OnInit
{
  /** {@inheritDoc IBaseProps.cssClass} */
  @Input()
  public class?: any;

  /** {@inheritDoc IBaseProps.context} */
  @Input()
  public context?: any;

  /**
   * {@inheritDoc IBaseProps.locale}
   * @group Localizations
   */
  @Input()
  public locale?: any;

  /** {@inheritDoc IBaseProps.modules} */
  @Input()
  public modules?: IModule[];

  /** {@inheritDoc IBaseProps} */
  @Input()
  public options?: PropsType;

  /** {@inheritDoc IBaseProps.responsive} */
  @Input()
  public responsive?: { [key: string]: PropsType };

  /**
   * {@inheritDoc IBaseProps.rtl}
   * @group Localizations
   */
  @Input()
  public rtl?: boolean;

  /** {@inheritDoc IBaseProps.theme} */
  @Input()
  public theme?: string;

  /** {@inheritDoc IBaseProps.themeVariant} */
  @Input()
  public themeVariant?: 'light' | 'dark' | 'auto';

  /** {@inheritDoc IBaseProps.touchUi} */
  @Input()
  public touchUi?: boolean | 'auto';

  /** @hidden */
  @Output()
  public valueChange = new EventEmitter<any>();

  /**
   * {@inheritDoc IBaseProps.onDestroy}
   * @event
   */
  @Output()
  public onDestroy: EventEmitter<any> = new EventEmitter();

  /**
   *
   * {@inheritDoc IBaseProps.onInit}
   * @event
   */
  @Output()
  public onInit: EventEmitter<any> = new EventEmitter(true);

  /** @hidden */
  public state: StateType = {} as StateType;

  /** @hidden */
  public props: PropsType = {} as PropsType;

  /** @hidden */
  public _el: any; // Needs to be any for SSR
  /** @hidden */
  public _shouldEnhance?: HTMLElement | string | boolean | null;
  /** @hidden */
  public _val: any;
  /** @hidden */
  public _onFormChange: (value: any) => any = noop; // Needed for AOT
  /** @hidden */
  public _onFormTouch: (ev?: any) => any = noop; // Needed for AOT

  protected _opt?: PropsType;

  private _doCheck?: boolean;
  private _ctxChange!: number;

  /** @hidden */
  constructor(
    protected _cdr: ChangeDetectorRef,
    protected _elr: ElementRef,
    protected _zone: NgZone,
    protected _sanitizer: DomSanitizer,
    protected _injector: Injector,
    protected _vcf: ViewContainerRef,
    @Optional() @Self() protected _ctrl: NgControl,
    @Optional() protected _optp: MbscOptionsService<PropsType>,
    @Optional() @Inject(MBSC_OPTIONS) _globals: any,
  ) {
    if (_optp) {
      this._opt = _optp.options;
      this._ctxChange = _optp.change.subscribe((nextOptions) => {
        this._opt = nextOptions;
        this.forceUpdate();
      });
    } else if (_globals) {
      this._opt = _globals;
    }
    if (_ctrl) {
      _ctrl.valueAccessor = this as any;
    }
    this._ctor();
  }

  /** @hidden */
  public get value() {
    return this._val;
  }

  /** @hidden */
  @Input()
  public set value(val: any) {
    if (this._val !== val) {
      updateValue(this, val);
      (this as any)._onFormChange(val);
      this.valueChange.emit(val);
    }
  }

  /** @hidden */
  public ngOnChanges(changes: SimpleChanges) {
    const optionsKey = 'options';
    const optionsChange = changes[optionsKey];
    if (optionsChange) {
      const opt = optionsChange.currentValue;
      if (opt) {
        for (const key of Object.keys(opt)) {
          (this.props as any)[key] = opt[key];
        }
      }
    }
    for (const key of Object.keys(changes)) {
      (this.props as any)[key] = changes[key].currentValue;
    }
    this._doCheck = true;
  }

  /** @hidden */
  public ngDoCheck() {
    if (this._doCheck) {
      this._willUpdate();
    }
  }

  /** @hidden */
  public ngAfterViewChecked() {
    if (this._doCheck) {
      this._updated();
    }
    this._doCheck = false;
  }

  /** @hidden */
  public ngOnInit() {
    this._doCheck = true;
    this._init();
  }

  /** @hidden */
  public ngAfterViewInit() {
    this._el = this._el || this._elr.nativeElement;
    this._baseInit(); // For base class
    this._mounted();
  }

  /** @hidden */
  public ngOnDestroy() {
    if (this._optp) {
      this._optp.change.unsubscribe(this._ctxChange);
    }
    this._destroy();
    this._baseDestroy(); // For base class
  }

  /** @hidden */
  public _getKey(index: number): number {
    return index;
  }

  /** @hidden */
  public forceUpdate() {
    if (NgZone.isInAngularZone()) {
      this._doCheck = true;
      this._cdr.markForCheck();
    } else {
      this._zone.run(() => {
        this._doCheck = true;
        this._cdr.markForCheck();
      });
    }
  }

  /** @hidden */
  public setState(newState: any) {
    let changed: boolean | undefined;
    for (const key of Object.keys(newState)) {
      if ((this.state as any)[key] !== newState[key]) {
        (this.state as any)[key] = newState[key];
        changed = true;
      }
    }
    if (changed) {
      this.forceUpdate();
    }
  }

  protected _emit(name: string, args: any) {
    const emitter = (this as any)[name];
    if (emitter && emitter instanceof EventEmitter) {
      emitter.emit(args);
    }
  }

  protected _safeHtml(html: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  protected _ctor() {}

  protected _init() {}

  protected _baseInit() {}

  protected _mounted() {}

  protected _updated() {}

  protected _destroy() {}

  protected _baseDestroy() {}

  protected _willUpdate() {}
}
