import { Directive } from '@angular/core';
import { Base } from '@framework/base';
import { MbscLocale } from '../i18n/locale';
import { MbscResponsiveOptions } from './commons';
import { autoDetect, globalChanges, options as globals, themes } from './commons';
import { UNDEFINED } from './util/misc';
import { isDarkQuery, os, touchUi } from './util/platform';

/* TRIALPARAM */

export const version = '6.1.3';

let guid = 0;

const BREAKPOINTS: { [key: string]: number } = {
  large: 992,
  medium: 768,
  small: 576,
  xlarge: 1200,
  xsmall: 0,
};

/**
 * @hidden
 * Interface for modules, add-ons
 */
export interface IModule {
  init(inst: any): void;
}

/**
 * Preact with typescript complains about these props missing,
 * so adding it here
 */
export interface IBaseProps<T = any> {
  /**
   * Specifies a custom CSS class for the component.
   * @defaultValue undefined
   */
  cssClass?: string;
  /**
   * Specifies different options for different container widths, in a form of an object,
   * where the keys are the name of the breakpoints, and the values are objects containing the options for the given breakpoint.
   *
   * :::info
   * The available width is queried from the container element of the component and not the browsers viewport like in css media queries
   * :::
   * There are five predefined breakpoints:
   *
   * - `xsmall` - min-width: 0px
   * - `small` - min-width: 576px
   * - `medium` - min-width: 768px
   * - `large` - min-width: 992px
   * - `xlarge` - min-width: 1200px
   *
   * Custom breakpoints can be defined by passing an object containing the `breakpoint` property specifying the min-width in pixels.
   * Example:
   *
   * ```
   * responsive: {
   *   small: {
   *     display: 'bottom'
   *   },
   *   custom: { // Custom breakpoint, you can use multiple, but each must have a unique name
   *     breakpoint: 600,
   *     display: 'center'
   *   },
   *   large: {
   *     display: 'anchored'
   *   }
   * }
   * ```
   *
   * @defaultValue undefined
   */
  responsive?: MbscResponsiveOptions<T>;
  /**
   * Enables right-to-left display.
   *
   * @defaultValue false
   * @group Localizations
   */
  rtl?: boolean;
  /**
   * Specifies the visual appearance of the component.
   *
   * If it is `'auto'` or `undefined`, the theme will automatically be chosen based on the platform.
   * If custom themes are also present, they will take precedence over the built in themes, e.g. if there's an iOS based custom theme,
   * it will be chosen on the iOS platform instead of the default iOS theme.
   *
   * Supplied themes:
   * - `'ios'` - iOS theme
   * - `'material'` - Material theme
   * - `'windows'` - Windows theme
   *
   * It's possible to [modify theme colors](../theming/sass-variables) or
   * [create custom themes](../theming/sass-themes).
   *
   * :::info
   * Make sure that the theme you set is included in the downloaded package.
   * :::
   *
   * @defaultValue undefined
   */
  theme?: string;
  /**
   * Controls which variant of the [theme](#opt-theme) will be used (light or dark).
   *
   * Possible values:
   * - `'light'` - Use the light variant of the theme.
   * - `'dark'` - Use the dark variant of the theme.
   * - `'auto'` or `undefined` - Detect the preferred system theme on devices where this is supported.
   *
   * To use the option with custom themes, make sure to create two custom themes, where the dark version has the same name as the light one,
   * suffixed with `'-dark'`, e.g.: `'my-theme'` and `'my-theme-dark'`.
   *
   * @defaultValue undefined
   */
  themeVariant?: 'light' | 'dark' | 'auto';
  /** @hidden */
  touchUi?: boolean | 'auto';
  /**
   * Sets the language of the component. The locale object contains all the translations for a given language.
   * The built in language modules are listed below. If a language is not listed, it can be provided as a
   * [custom language module](https://mobiscroll.com/docs/core-concepts/localization#language-modules).
   *
   * Supported values:
   * - Arabic: `localeAr`, `'ar'`
   * - Bulgarian: `localeBg`, `'bg'`
   * - Catalan: `localeCa`, `'ca'`
   * - Czech: `localeCs`, `'cs'`
   * - Chinese: `localeZh`, `'zh'`
   * - Croatian: `localeHr`, `'hr'`
   * - Danish: `localeDa`, `'da'`
   * - Dutch: `localeNl`, `'nl'`
   * - English: `localeEn` or `undefined`, `'en'`
   * - English (UK): `localeEnGB`, `'en-GB'`
   * - Farsi: `localeFa`, `'fa'`
   * - German: `localeDe`, `'de'`
   * - Greek: `localeEl`, `'el'`
   * - Spanish: `localeEs`, `'es'`
   * - Finnish: `localeFi`, `'fi'`
   * - French: `localeFr`, `'fr'`
   * - Hebrew: `localeHe`, `'he'`
   * - Hindi: `localeHi`, `'hi'`
   * - Hungarian: `localeHu`, `'hu'`
   * - Italian: `localeIt`, `'it'`
   * - Japanese: `localeJa`, `'ja'`
   * - Korean: `localeKo`, `'ko'`
   * - Lithuanian: `localeLt`, `'lt'`
   * - Norwegian: `localeNo`, `'no'`
   * - Polish: `localePl`, `'pl'`
   * - Portuguese (Brazilian): `localePtBR`, `'pt-BR'`
   * - Portuguese (European): `localePtPT`, `'pt-PT'`
   * - Romanian: `localeRo`, `'ro'`
   * - Russian: `localeRu`, `'ru'`
   * - Russian (UA): `localeRuUA`, `'ru-UA'`
   * - Slovak: `localeSk`, `'sk'`
   * - Serbian: `localeSr`, `'sr'`
   * - Swedish: `localeSv`, `'sv'`
   * - Thai: `localeTh`, `'th'`
   * - Turkish: `localeTr`, `'tr'`
   * - Ukrainian: `localeUa`, `'ua'`
   *
   * [[subtypes-hidden]]
   * @defaultValue undefined
   * @group Localizations
   */
  locale?: MbscLocale;

  /** @hidden */
  modules?: IModule[];
  /** @hidden */
  baseTheme?: any;
  /** @hidden */
  children?: any;
  /** @hidden */
  class?: string;
  /** @hidden */
  className?: string;
  /** @hidden */
  context?: string | HTMLElement;
  /** @hidden */
  dangerouslySetInnerHTML?: any;
  /** @hidden */
  hasChildren?: boolean;
  /** @hidden */
  key?: any;
  /** @hidden */
  ref?: any;
  /** @hidden */
  style?: any;

  /**
   * @event
   * Triggered when the component is destroyed.
   * @param args - The event argument object.
   * @param inst - The component instance.
   */
  onDestroy?(args: any, inst: any): void;
  /**
   * @event
   * Triggered when the component is initialized.
   * @param args - The event argument object.
   * @param inst - The component instance.
   */
  onInit?(args: any, inst: any): void;
}

export interface IBaseEvent<T> {
  inst?: T;
  type?: string;
}

let isDark: boolean;

if (isDarkQuery) {
  isDark = isDarkQuery.matches;
  // The addListener is deprecated, however addEventListener does not have the necessary browser support
  isDarkQuery.addListener((ev: any) => {
    isDark = ev.matches;
    globalChanges.next();
  });
}

/** @hidden */
@Directive({ selector: '[mbsc-bc]' })
export class BaseComponent<PropType extends IBaseProps, StateType> extends Base<PropType, StateType> {
  /** @hidden */
  public static defaults: any = UNDEFINED;

  protected static _name = '';

  /** @hidden */
  public s: PropType = {} as PropType;

  /** @hidden */
  public state: StateType = {} as StateType;

  /** @hidden */
  public _className!: string;

  /** @hidden */
  public _hb!: string;

  /**
   * Used to identify if it's a mobiscroll component
   * @hidden
   */
  public _mbsc = true;

  /** @hidden */
  public _rtl!: string;

  /** @hidden */
  public _theme!: string;

  /** @hidden */
  public _touchUi!: boolean;

  /** @hidden */
  public _v: any = {
    version: '6.1.3', // TODO this is for CLI only, should be removed later
  };

  /**
   * Needed for preact for dynamic updates, because props is immutable.
   * Merge this into the computed settings as well.
   */
  // protected _newProps: any;

  protected _prevS!: PropType;

  protected _respProps?: PropType;

  protected _zone: any;

  protected _optChange?: number;

  protected _uid = ++guid;

  /* TRIALFUNC */

  /** @hidden */
  public get nativeElement(): HTMLElement {
    return this._el;
  }

  /** @hidden */
  public destroy() {}

  /** @hidden */
  public _hook<T>(name: string, args: T): any {
    const s = this.s as any;
    (args as any).inst = this;
    (args as any).type = name;
    if (s[name]) {
      return s[name](args, this);
    }
    this._emit(name, args);
  }

  /** @hidden */
  public _proxyHook = (args: any): any => {
    this._hook(args.type, args);
  };

  protected _baseInit() {
    const self = this.constructor as typeof BaseComponent;
    // Subscribe only for top level components. Subcomponents get their settings from the top.
    // Checking the top level by the existence of static defaults property
    if (self.defaults) {
      this._optChange = globalChanges.subscribe(() => {
        this.forceUpdate();
      });
      // The this.s.modules is not ready yet bc ngOnInit is called before ngDoCheck (when the first _merge is)
      const modules = this.props.modules as IModule[];
      if (modules) {
        for (const module of modules) {
          if (module.init) {
            module.init(this);
          }
        }
      }
    }
    this._hook('onInit', {});
  }

  protected _baseDestroy() {
    if (this._optChange !== UNDEFINED) {
      globalChanges.unsubscribe(this._optChange);
    }
    this._hook('onDestroy', {});
  }

  protected _render(s: PropType, state: StateType) {
    return;
  }

  protected _willUpdate() {
    this._merge();
    this._render(this.s, this.state);
  }

  private _resp(s: any) {
    const resp = s.responsive;
    let ret: any;
    let br = -1;
    let width = (this.state as any).width;

    // Default to 375 (a standard mobile view), if width is not yet calculated
    if (width === UNDEFINED) {
      width = 375;
    }

    if (resp && width) {
      for (const key of Object.keys(resp)) {
        const value = resp[key];
        const breakpoint = value.breakpoint || BREAKPOINTS[key];
        if (width >= breakpoint && breakpoint > br) {
          ret = value;
          br = breakpoint;
        }
      }
    }
    return ret;
  }

  private _merge() {
    const self = this.constructor as typeof BaseComponent;
    const defaults = self.defaults;
    const context: any = this._opt || {};
    const props: any = {};
    let s: PropType;
    let themeDef: any;

    this._prevS = this.s || ({} as PropType);

    // TODO: don't merge if setState call
    if (defaults) {
      // Filter undefined values
      for (const prop in this.props) {
        if ((this.props as any)[prop] !== UNDEFINED) {
          props[prop] = (this.props as any)[prop];
        }
      }

      // Load locale options
      const locale: any = props.locale || context.locale || globals.locale || {};
      const calendarSystem: any = props.calendarSystem || locale.calendarSystem || context.calendarSystem || globals.calendarSystem;

      // Load theme options
      let themeName: string = props.theme || context.theme || globals.theme;
      const themeVariant: string = props.themeVariant || context.themeVariant || globals.themeVariant;

      if (themeName === 'auto' || !themeName) {
        themeName = autoDetect.theme || '';
      }

      // Set dark theme if:
      // - themeVariant is explicitly set to dark OR
      // - themeVariant is auto or not set, and system theme is dark
      // Also check if the theme exists in the themes object
      if ((themeVariant === 'dark' || (isDark && (themeVariant === 'auto' || !themeVariant))) && themes[themeName + '-dark']) {
        themeName += '-dark';
      }

      // Write back the auto-detected theme
      props.theme = themeName;

      themeDef = themes[themeName];
      const theme = themeDef && themeDef[self._name];

      // Merge everything together
      s = {
        ...defaults,
        ...theme,
        ...locale,
        ...globals,
        ...context,
        ...calendarSystem, // TODO: something more generic here?
        ...props,
      };

      // Merge responsive options
      const resp = this._resp(s);
      this._respProps = resp;
      if (resp) {
        s = {
          ...(s as any), // For older Typescript / Angular 4
          ...resp,
        };
      }
    } else {
      s = { ...this.props };
      themeDef = themes[s.theme!];
    }

    const baseTheme = themeDef && themeDef.baseTheme;
    s.baseTheme = baseTheme;

    this.s = s;
    this._className = s.cssClass || s.class || s.className || '';
    this._rtl = ' mbsc-' + (s.rtl ? 'rtl' : 'ltr');
    this._theme = ' mbsc-' + s.theme + (baseTheme ? ' mbsc-' + baseTheme : '');
    this._touchUi = s.touchUi === 'auto' || s.touchUi === UNDEFINED ? touchUi : s.touchUi;
    this._hb = os === 'ios' && (s.theme === 'ios' || baseTheme === 'ios') ? ' mbsc-hb' : '';
  }
}
