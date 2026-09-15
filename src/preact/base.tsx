import { PureComponent } from './pure';
import { enhance } from './renderer';

export interface IDirectiveType {
  standalone?: boolean;
}

export function Directive(args: any) {
  return (ctor: any) => ctor;
}

export class Base<PropsType, StateType> extends PureComponent<PropsType, StateType> {
  /** @hidden */
  public static _fname: string;
  /** @hidden */
  public static _selector: string;
  /** @hidden */
  public static _renderOpt: any;

  /** @hidden */
  public s!: PropsType;

  public _el!: HTMLElement;

  /** @hidden */
  public _shouldEnhance?: HTMLElement | string | boolean | null;

  protected _opt: any;

  protected _newProps: any = {};

  private _baseValue: any;

  public get value(): any {
    return this._baseValue;
  }
  public set value(v: any) {
    this._baseValue = v;
  }

  /** @hidden */
  public componentDidMount() {
    this._baseInit(); // For base class
    this._init();
    this._mounted();
    this._updated();
    this._enhance();
  }

  /** @hidden */
  public componentDidUpdate() {
    this._updated();
    this._enhance();
  }

  /** @hidden */
  public componentWillUnmount() {
    this._destroy();
    this._baseDestroy(); // For base class
  }

  /** @hidden */
  public render(): any {
    this._willUpdate();
    return this._template(this.s, this.state);
  }

  /** @hidden */
  public getInst() {
    return this;
  }

  /**
   * Sets or updates options of the component. Options can be updated dynamically after the initialization.
   *
   * It receives an options object as parameter. Calling `setOptions` will overwrite all the options that
   * have a key in the options object parameter, and it will re-render the component.
   *
   * ```js
   * inst.setOptions({
   *   themeVarian: 'dark',
   * })
   * ```
   * @method javascript
   * @method jquery
   */
  public setOptions(opt: PropsType) {
    for (const prop in opt) {
      this.props[prop] = opt[prop] as any;
    }
    this.forceUpdate();
  }

  /** @hidden */
  public _setEl = (el: any) => {
    this._el = el ? el._el || el : null;
  };

  /** @hidden */
  public _safeHtml(html: string): any {
    return { __html: html };
  }

  protected _init(): void {}

  protected _baseInit(): void {}

  protected _emit(name: string, args: any): void {}

  protected _template(s: PropsType, state: StateType): any {}

  protected _mounted(): void {}

  protected _updated(): void {}

  protected _destroy(): void {}

  protected _baseDestroy(): void {}

  protected _willUpdate(): void {}

  private _enhance(): void {
    const shouldEnhance = this._shouldEnhance;
    if (shouldEnhance) {
      enhance(shouldEnhance === true ? this._el : shouldEnhance);
      this._shouldEnhance = false;
    }
  }
}
