import { Popup } from '../../core/components/popup/popup.common';
import { MbscPopupOptions } from '../../core/components/popup/popup.types.public';
import { renderOptions } from '../../preact/components/popup';
import { createComponentFactory } from '../base';

export const popup = /*#__PURE__*/ createComponentFactory<MbscPopupOptions, Popup>(Popup, renderOptions);

export { Popup };

// Types
export * from '../../core/components/popup/popup.types.public';
