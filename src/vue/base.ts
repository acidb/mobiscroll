import { defineComponent } from 'vue';
import { UNDEFINED } from '../core/util/misc';
import { isBrowser } from '../core/util/platform';

declare module 'vue' {
  interface HTMLAttributes {
    className?: any;
    dangerouslySetInnerHTML?: any;
    readOnly?: any;
    tabIndex?: any;
  }

  interface SVGAttributes {
    className?: any;
  }
}

export interface IDirectiveType {
  standalone?: boolean;
}

export function Directive(args: any) {
  return (ctor: any) => ctor;
}

/** @hidden */
export class Base<PropsType, StateType> {
  /** @hidden */
  public state: StateType = {} as StateType;

  /** @hidden */
  public props: PropsType = {} as PropsType;

  /** @hidden */
  public s!: PropsType;

  /** @hidden */
  public _el!: HTMLElement;

  /** @hidden */
  public _shouldEnhance?: HTMLElement | string | boolean | null;

  /** @hidden */
  public _vue: any;

  protected _opt: any;

  private _baseValue: any;

  constructor(props: PropsType) {}

  /** @hidden */
  public get value(): any {
    return this._baseValue;
  }
  /** @hidden */
  public set value(v: any) {
    this._baseValue = v;
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

  /** @hidden */
  public _safeHtml(html: string): string {
    return html;
  }

  /** @hidden */
  public _setEl = (el: any) => {
    this._el = el ? el._el || el : null;
  };

  /** @hidden */
  public forceUpdate() {
    // Calling forceUpdate on server side sometimes results in error
    if (isBrowser) {
      this._vue.$forceUpdate();
    }
  }

  protected _init() {}

  protected _baseInit() {}

  protected _emit(name: string, args: any): void {
    const ev = name.replace(/^on/, '');
    this._vue.$emit(ev[0].toLowerCase() + ev.slice(1), args);
  }

  protected _mounted() {}

  protected _updated() {}

  protected _destroy() {}

  protected _baseDestroy() {}

  protected _willUpdate() {}
}

export const Bool = { type: Boolean, default: UNDEFINED };

export const baseProps = {
  baseTheme: String,
  className: String,
  cssClass: String,
  locale: [String, Object],
  modules: [Object],
  responsive: Object,
  rtl: Bool,
  theme: String,
  themeVariant: String,
  touchUi: { type: [Boolean, String], default: UNDEFINED },

  // Event handlers
  onDestroy: Function,
  onInit: Function,
};

// TODO: use types
export function createComponent<Props>(Component: any, data: any) {
  return defineComponent<Props>({
    created() {
      const inst = new Component();
      this.instance = inst;
      inst.props = this.$props;
      inst._vue = this;
      if (this._init) {
        this._init(inst);
      }
      inst._baseInit(); // For base class
      inst._init();
    },
    mounted() {
      const inst = this.instance;
      if (this._mounted) {
        this._mounted(inst);
      }
      inst._mounted();
      inst._updated();
    },
    updated() {
      const inst = this.instance;
      if (this._updated) {
        this._updated(inst);
      }
      inst._updated();
    },
    beforeUnmount() {
      const inst = this.instance;
      if (this._destroy) {
        this._destroy(inst);
      }
      inst._destroy();
      inst._baseDestroy(); // For base class
    },
    render() {
      const inst = this.instance;
      inst._willUpdate();
      return this._template(inst.s, inst.state, inst);
    },
    ...data,
  });
}
