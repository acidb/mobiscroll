import { PureComponent, ReactNode } from 'react';
import { Options } from './options';

export interface IDirectiveType {
  standalone?: boolean;
}

export function Directive(args: any) {
  return (ctor: any) => ctor;
}

/** @hidden */
export class Base<PropsType, StateType> extends PureComponent<PropsType, StateType> {
  /** @hidden */
  public static propTypes: any;

  /** @hidden */
  public static contextType = Options;

  /** @hidden */
  public s!: PropsType;

  /** @hidden */
  public _el!: HTMLElement;

  /** @hidden */
  public _shouldEnhance?: HTMLElement | string | boolean | null;

  protected _opt: any;

  private _baseValue: any;

  /** @hidden */
  public get value(): any {
    return this._baseValue;
  }
  /** @hidden */
  public set value(v: any) {
    this._baseValue = v;
  }

  /** @hidden */
  public componentDidMount() {
    this._baseInit(); // For base class
    this._init();
    this._mounted();
    this._updated();
  }

  /** @hidden */
  public componentDidUpdate() {
    this._updated();
  }

  /** @hidden */
  public componentWillUnmount() {
    this._destroy();
    this._baseDestroy(); // For base class
  }

  /** @hidden */
  public render(): ReactNode {
    this._opt = this.context;
    this._willUpdate();
    return this._template(this.s, this.state);
  }

  /** @hidden */
  public _setEl = (el: any) => {
    this._el = el ? el._el || el : null;
  };

  /** @hidden */
  public _safeHtml(html: string): { __html: string } {
    return { __html: html };
  }

  protected _init(): void {}

  protected _baseInit(): void {}

  protected _emit(name: string, args: any): void {}

  protected _mounted(): void {}

  protected _updated(): void {}

  protected _destroy(): void {}

  protected _baseDestroy(): void {}

  protected _willUpdate(): void {}

  protected _template(s: PropsType, state: StateType): ReactNode {
    return;
  }
}
