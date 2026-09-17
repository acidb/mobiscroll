/** @jsxRuntime classic */
/** @jsx createElement */
import {
  getAlertOptions,
  getConfirmOptions,
  getPromptOptions,
  getSnackbarOptions,
  getToastOptions,
  promise,
  showModal,
  showNotification,
} from '@framework/../core/components/notifications/notifications';
import {
  INotificationOptions,
  MbscAlertOptions,
  MbscConfirmOptions,
  MbscPromptOptions,
  MbscSnackbarOptions,
  MbscToastOptions,
} from '@framework/../core/components/notifications/notifications.types';
import { PopupBase } from '@framework/../core/components/popup/popup';
import { MbscPopupOptions } from '@framework/../core/components/popup/popup.types.public';
import { Button } from '@framework/components/button';
import { Input } from '@framework/components/input';
import { Popup } from '@framework/components/popup';
import { createElement, render, unmountComponentAtNode } from '@framework/renderer';
import { doc } from '../../util/dom';
import { UNDEFINED } from '../../util/misc';

import './notifications.scss';

/**
 * Returns content for alert and confirm.
 * @hidden
 * @param options
 */
export function getAlertContent(options: MbscAlertOptions | MbscConfirmOptions) {
  return (
    <div className="mbsc-alert-content">
      {options.title && <h2 className="mbsc-alert-title">{options.title}</h2>}
      <p className="mbsc-alert-message"> {options.message || ''} </p>
    </div>
  );
}

/**
 * Returns content for prompt
 * @hidden
 * @param options
 */
export function getPromptContent(options: MbscPromptOptions, onInputChange: (event: any) => void, getVal: () => any) {
  return (
    <div className="mbsc-alert-content">
      {options.title && <h2 className="mbsc-alert-title">{options.title}</h2>}
      <p className="mbsc-alert-message"> {options.message || ''}</p>
      <div className="mbsc-form-group-inset">
        <Input
          className="mbsc-prompt-input"
          label={options.label}
          onInput={onInputChange}
          placeholder={options.placeholder || ''}
          type={options.inputType}
          theme={options.theme}
          themeVariant={options.themeVariant}
          defaultValue={getVal()}
        />
      </div>
    </div>
  );
}

/**
 * Returns content for toast.
 * @hidden
 * @param options
 */
export function getToastContent(options: MbscToastOptions) {
  return <div className="mbsc-toast-background mbsc-toast-message">{options.message || ''}</div>;
}

/**
 * Returns content for snackbar.
 * @hidden
 * @param options
 */
export function getSnackbarContent(options: MbscSnackbarOptions, onButtonClick: () => void) {
  return (
    <div className="mbsc-toast-background mbsc-snackbar-cont mbsc-flex">
      <div className="mbsc-snackbar-message mbsc-flex-1-1">{options.message || ''}</div>
      {options.button && (
        <Button
          className="mbsc-snackbar-button"
          icon={options.button.icon}
          onClick={onButtonClick}
          theme={options.theme}
          themeVariant={options.themeVariant}
          variant="flat"
        >
          {options.button.text}
        </Button>
      )}
    </div>
  );
}

function createPopup(
  content: any,
  options: INotificationOptions<any>,
  getPopupOptions: (
    options: INotificationOptions<any>,
    destroy: () => void,
    resolve: () => void,
    getValue?: () => string,
  ) => MbscPopupOptions,
  showFunc: (popup: PopupBase) => void,
  resolve: (result?: any) => void,
  setInst?: (popup: PopupBase) => void,
  getValue?: () => string,
) {
  if (!doc) {
    // SSR
    return;
  }

  const elm = doc.createElement('div');
  const init = (args: any, inst: PopupBase) => {
    if (setInst) {
      setInst(inst);
    }
    showFunc(inst);
  };
  const destroy = () => {
    // Need setTimeout here to make sure closing is complete before destroy
    setTimeout(() => {
      unmountComponentAtNode(elm);
    });
  };
  const s = getPopupOptions(options, destroy, resolve, getValue);
  const popupElm = (
    <Popup onInit={init} {...s}>
      {content}
    </Popup>
  );

  // Render the popup
  render(popupElm, elm);
}

function showToast(options: MbscToastOptions, resolve: () => void) {
  createPopup(getToastContent(options), options, getToastOptions, showNotification, resolve);
}

function showSnackbar(options: MbscSnackbarOptions, resolve: () => void) {
  let popupInst: PopupBase | undefined;
  const onButtonClick = () => {
    if (popupInst) {
      popupInst.close();
      if (options.button && options.button.action) {
        options.button.action();
      }
    }
  };
  const content = getSnackbarContent(options, onButtonClick);
  createPopup(content, options, getSnackbarOptions, showNotification, resolve, (inst) => {
    popupInst = inst;
  });
}

function showAlert(options: MbscAlertOptions, resolve: () => void) {
  createPopup(getAlertContent(options), options, getAlertOptions, showModal, resolve);
}

function showConfirm(options: MbscConfirmOptions, resolve: (result: boolean) => void) {
  createPopup(getAlertContent(options), options, getConfirmOptions, showModal, resolve);
}

function showPrompt(options: MbscPromptOptions, resolve: (result: string | null) => void) {
  let value = options.value || '';
  const onInputChange = (event: any) => {
    value = event.target.value;
  };
  const getVal = () => value;
  createPopup(getPromptContent(options, onInputChange, getVal), options, getPromptOptions, showModal, resolve, UNDEFINED, getVal);
}

export function toast(options: MbscToastOptions): Promise<undefined> {
  return promise(showToast, options);
}

export function snackbar(options: MbscSnackbarOptions): Promise<undefined> {
  return promise(showSnackbar, options);
}

export function alert(options: MbscAlertOptions): Promise<undefined> {
  return promise(showAlert, options);
}

export function confirm(options: MbscConfirmOptions): Promise<boolean> {
  return promise(showConfirm, options);
}

export function prompt(options: MbscPromptOptions): Promise<string | null> {
  return promise(showPrompt, options);
}
