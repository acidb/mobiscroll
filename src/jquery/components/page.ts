import { Page as PageComp } from '../../core/components/page/page.common';
import { renderOptions } from '../../preact/components/page';

class Page extends PageComp {
  public static _fname = 'page';
  public static _selector = '[mbsc-page]';
  public static _renderOpt = renderOptions;
}

export { Page };

// Types
export * from '../../core/components/page/page.types.public';
