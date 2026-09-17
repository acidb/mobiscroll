import { Popup as PopupComp } from '../../core/components/popup/popup.common';
import { renderOptions } from '../../preact/components/popup';

class Popup extends PopupComp {
  public static _fname = 'popup';
  public static _renderOpt = renderOptions;
}

export { Popup };

// Types
export * from '../../core/components/popup/popup.types.public';
