import { MbscPopupOptions } from '../../core/components/popup/popup.types.public';
import { getDocument } from '../../core/util/dom';
import { IRenderOptions } from '../renderer';

export { Popup } from '../../core/components/popup/popup.common';

export const renderOptions: IRenderOptions = {
  before(elm: HTMLElement, options: MbscPopupOptions) {
    let onOpen: any;
    let onClosed: any;

    if (options.onOpen) {
      onOpen = options.onOpen;
    }

    if (options.onClosed) {
      onClosed = options.onClosed;
    }

    // Create a placeholder element
    const doc = getDocument(elm);
    const ph = doc && doc.createComment('popup');

    if (ph && elm.parentNode) {
      elm.parentNode.insertBefore(ph, elm);
    }

    // Hide element
    elm.style.display = 'none';

    options.onOpen = (ev: any, inst) => {
      // Show element
      elm.style.display = '';
      // Find popup content element
      const popupContent = ev.target.querySelector('.mbsc-popup-content');
      popupContent.appendChild(elm);
      if (onOpen) {
        onOpen.call(this, ev, inst);
      }
    };

    options.onClosed = (ev: any, inst) => {
      // Hide element
      elm.style.display = 'none';
      // Put element back to place
      if (ph && ph.parentNode) {
        ph.parentNode.insertBefore(elm, ph);
      }

      if (onClosed) {
        onClosed.call(this, ev, inst);
      }
    };
  },
};
