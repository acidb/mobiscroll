import { Page as PageComp } from '../../core/components/page/page.common';
import { MbscPageOptions } from '../../core/components/page/page.types.public';
import { renderOptions } from '../../preact/components/page';
import { createComponentFactory } from '../base';

class Page extends PageComp {
  public static _selector = '[mbsc-page]';
  public static _renderOpt = renderOptions;
}

export const page = /*#__PURE__*/ createComponentFactory<MbscPageOptions, Page>(Page, renderOptions);

export { Page };

// Types
export * from '../../core/components/page/page.types.public';
