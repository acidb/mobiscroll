/* eslint-disable react/no-string-refs */
/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement } from '@framework/renderer';
import { defineComponent } from 'vue';
import {
  getAlertOptions,
  getConfirmOptions,
  getPromptOptions,
  getSnackbarOptions,
  getToastOptions,
  showModal,
  showNotification,
} from '../../core/components/notifications/notifications';
import {
  getAlertContent,
  getPromptContent,
  getSnackbarContent,
  getToastContent,
} from '../../core/components/notifications/notifications.common';
import { UNDEFINED } from '../../core/util/misc';
import { Bool } from '../base';
import { Popup } from './popup';

export * from '../../core/components/notifications/notifications.types.public';

const notificationProps = {
  animation: String,
  callback: Function,
  context: String,
  cssClass: String,
  display: String,
  isOpen: Bool,
  message: String,
  theme: String,
  themeVariant: String,

  // Event handlers
  onClose: Function,
};

const alertProps = {
  ...notificationProps,
  okText: String,
  title: String,
};

const confirmProps = {
  ...notificationProps,
  cancelText: String,
  okText: String,
  title: String,
};

const promptProps = {
  ...notificationProps,
  cancelText: String,
  inputType: String,
  label: String,
  okText: String,
  placeholder: String,
  title: String,
  value: String,
};

const toastProps = {
  ...notificationProps,
  color: String,
  duration: { type: [Boolean, Number], default: UNDEFINED },
};

const snackbarProps = {
  ...toastProps,
  button: Object,
};

const notificationMethods = {
  open() {
    const popup = this.$refs.popup;
    if (popup) {
      showModal(popup.instance);
    }
  },
  close() {
    const popup = this.$refs.popup;
    if (popup) {
      popup.instance.close();
    }
  },
};

const isOpenWatch = {
  isOpen(newOpen: boolean, oldOpen: boolean) {
    if (newOpen !== oldOpen) {
      if (newOpen) {
        this.open();
      } else {
        this.close();
      }
    }
  },
};

const toastOpen = function () {
  const popup = this.$refs.popup;
  if (popup) {
    showNotification(popup.instance);
  }
};

export const MbscAlert = defineComponent({
  components: { Popup },
  methods: notificationMethods,
  props: alertProps,
  watch: isOpenWatch,
  render() {
    const s = this.$props;
    const opts = getAlertOptions(s) || {};
    return (
      <Popup ref="popup" {...opts}>
        {getAlertContent(s)}
      </Popup>
    );
  },
});

export const MbscConfirm = defineComponent({
  components: { Popup },
  methods: notificationMethods,
  props: confirmProps,
  watch: isOpenWatch,
  render() {
    const s = this.$props;
    const opts = getConfirmOptions(s);
    return (
      <Popup ref="popup" {...opts}>
        {getAlertContent(s)}
      </Popup>
    );
  },
});

export const MbscPrompt = defineComponent({
  components: { Popup },
  methods: notificationMethods,
  props: promptProps,
  watch: isOpenWatch,
  data() {
    return {
      val: this.$props.value,
    };
  },
  render() {
    const s = this.$props;
    const getVal = () => this.val;
    const resetVal = () => {
      this.val = this.$props.value || '';
    };
    const opts = getPromptOptions(s, UNDEFINED, UNDEFINED, getVal, resetVal);
    return (
      <Popup ref="popup" {...opts}>
        {getPromptContent(
          s,
          (event: any) => {
            this.val = event.target.value;
          },
          getVal,
        )}
      </Popup>
    );
  },
});

export const MbscToast = defineComponent({
  components: { Popup },
  methods: {
    ...notificationMethods,
    open: toastOpen,
  },
  props: toastProps,
  watch: isOpenWatch,
  render() {
    const s = this.$props;
    const opts = getToastOptions(s);
    return (
      <Popup ref="popup" {...opts}>
        {getToastContent(s)}
      </Popup>
    );
  },
});

export const MbscSnackbar = defineComponent({
  components: { Popup },
  methods: {
    ...notificationMethods,
    open: toastOpen,
    _onButtonClick() {
      const s = this.$props;
      this.close();

      if (s.button && s.button.action) {
        s.button.action();
      }
    },
  },
  props: snackbarProps,
  watch: isOpenWatch,
  render() {
    const s = this.$props;
    const opts = getSnackbarOptions(s);
    return (
      <Popup ref="popup" {...opts}>
        {getSnackbarContent(s, this._onButtonClick)}
      </Popup>
    );
  },
});
