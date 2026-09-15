import { MbscPopupDisplay } from './components/popup/popup.types.public';
import { MbscLocale } from './locale';
import { Observable } from './util/observable';
import { isBrowser, majorVersion, minorVersion, os } from './util/platform';

import './themes/ios-vars.scss';
import './themes/material-vars.scss';
import './themes/windows-vars.scss';

/**
 * @hidden
 */
export interface MbscCalendarSystem {
  getDate?: (y: number, m: number, d: number, h?: number, i?: number, s?: number, u?: number) => Date;
  getDay?: (d: Date) => number;
  getMaxDayOfMonth?: (y: number, m: number) => number;
  getMonth?: (d: Date) => number;
  getWeekNumber?: (d: Date) => number;
  getYear?: (d: Date) => number;
}

export interface MbscOptions {
  calendarSystem?: MbscCalendarSystem;
  display?: MbscPopupDisplay;
  locale?: MbscLocale;
  rtl?: boolean;
  theme?: string;
  themeVariant?: 'light' | 'dark' | 'auto';
}

export interface MbscResponsiveOptions<T = any> {
  /**
   * The keys are the names of the breakpoints, and the values are objects containing the options for the given breakpoint.
   * The `breakpoint` property, when present, specifies the min-width in pixels. The options will take into effect from that width.
   *
   * :::info
   * The available width is queried from the container element of the component and not the browsers viewport like in css media queries
   * :::
   *
   * There are five predefined breakpoints:
   *
   * - `xsmall` - min-width: 0px
   * - `small` - min-width: 576px
   * - `medium` - min-width: 768px
   * - `large` - min-width: 992px
   * - `xlarge` - min-width: 1200px
   */
  [key: string]: T & { breakpoint?: number };
}

/** @hidden */
export const options: MbscOptions = {};

/** @hidden */
export const util: any = {};

/** @hidden */
export const themes: { [key: string]: any } = {};

/** @hidden */
export const autoDetect: { theme?: string } = {};

/** @hidden */
export const globalChanges = new Observable<MbscOptions>();

/** @hidden */
export function getAutoTheme() {
  let autoTheme = '';
  let theme = '';
  let firstTheme = '';

  if (os === 'android') {
    theme = 'material';
  } else if (os === 'wp' || os === 'windows') {
    theme = 'windows';
  } else {
    theme = 'ios';
  }

  for (const key in themes) {
    // Stop at the first custom theme with the OS base theme
    if (themes[key].baseTheme === theme && themes[key].auto !== false && key !== theme + '-dark') {
      autoTheme = key;
      break;
    } else if (key === theme) {
      autoTheme = key;
    } else if (!firstTheme) {
      firstTheme = key;
    }
  }

  return autoTheme || firstTheme;
}

export function setOptions(local: Partial<MbscOptions> & { [other: string]: any }): void {
  for (const k of Object.keys(local)) {
    (options as any)[k] = local[k];
  }
  // Calling it on server side results in error in Nuxt with SSR
  if (isBrowser) {
    globalChanges.next(options);
  }
}

/**
 * Creates a custom theme definition object. It inherits the defaults from the specified base theme.
 * @param name Name of the custom theme.
 * @param baseTheme Name of the base theme (ios, material or windows).
 * @param auto Allow to set it as auto theme, if the component has theme: 'auto' set. True, if not set.
 */
export function createCustomTheme(name: string, baseTheme: string, auto?: boolean) {
  const base = themes[baseTheme];
  themes[name] = {
    ...base,
    auto,
    baseTheme,
  };
  autoDetect.theme = getAutoTheme();
}

export const platform = {
  majorVersion,
  minorVersion,
  name: os,
};
