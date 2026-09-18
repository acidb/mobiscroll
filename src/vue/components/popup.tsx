import { MbscPopupState, PopupBase } from '../../core/components/popup/popup';
import { template } from '../../core/components/popup/popup.common';
import { MbscPopupOptions } from '../../core/components/popup/popup.types.public';
import { UNDEFINED } from '../../core/util/misc';
import { baseProps, Bool, createComponent } from '../base';

export const popupProps = {
  ...baseProps,
  activeElm: [String, Object],
  anchor: Object,
  anchorAlign: String,
  animation: { type: [String, Boolean], default: UNDEFINED },
  ariaLabel: String,
  buttonVariant: String,
  buttons: Array,
  closeOnEsc: Bool,
  closeOnOverlayClick: Bool,
  closeOnScroll: Bool,
  contentPadding: Bool,
  context: [String, Object],
  disableLeftRight: Bool,
  display: String,
  focusElm: Object,
  focusOnClose: Bool,
  focusOnOpen: Bool,
  focusTrap: Bool,
  fullScreen: Bool,
  headerText: String,
  renderHeader: Function,
  height: [String, Number],
  isOpen: Bool,
  maxHeight: [String, Number],
  maxWidth: [String, Number],
  scrollLock: Bool,
  setActive: Bool,
  showArrow: Bool,
  showOverlay: Bool,
  width: [String, Number],
  windowWidth: Number,

  // Localization
  cancelText: String,
  closeText: String,
  okText: String,
  setText: String,

  // Event handlers
  onButtonClick: Function,
  onClose: Function,
  onClosed: Function,
  onKeyDown: Function,
  onOpen: Function,
  onPosition: Function,
  onResize: Function,
};

export const MbscPopup = createComponent<MbscPopupOptions>(PopupBase, {
  methods: {
    _template(s: MbscPopupOptions, state: MbscPopupState, inst: PopupBase) {
      return template(s, state, inst, this.$slots.default && this.$slots.default(), this.$slots);
    },
  },
  props: popupProps,
});

// Needed for the common templates
export { MbscPopup as Popup };
