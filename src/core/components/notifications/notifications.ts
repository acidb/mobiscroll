import { win } from '../../util/dom';
import { noop, UNDEFINED } from '../../util/misc';
import { isBrowser } from '../../util/platform';
import { PopupBase } from '../popup/popup';
import { MbscPopupOptions } from '../popup/popup.types.public';
import {
  INotificationOptions,
  MbscAlertOptions,
  MbscConfirmOptions,
  MbscPromptOptions,
  MbscSnackbarOptions,
  MbscToastOptions,
} from './notifications.types';

const popupQueue: PopupBase[] = [];
const notificationQueue: PopupBase[] = [];
const hasPromise: boolean = isBrowser && !!(win as any).Promise;

function getOptions(
  queue: PopupBase[],
  options: INotificationOptions<any>,
  more: MbscPopupOptions,
  destroy?: () => void,
  resolve?: (result?: any) => void,
): MbscPopupOptions {
  return {
    closeOnOverlayClick: false,
    context: options.context,
    cssClass: 'mbsc-alert',
    display: options.display || 'center',
    onClose: () => {
      queue.shift();
    },
    onClosed: () => {
      handleClose(options, destroy, resolve);
    },
    theme: options.theme,
    themeVariant: options.themeVariant,
    ...more,
  };
}

/**
 * Returns common options for toast and snackbar notification popups.
 * @param options Toast or snackbar options.
 * @param isToast Is it a toast?.
 * @param destroy Destroy function to be called on close.
 * @param resolve Promise resolve function to be called on close.
 */
function getToastSnackbarOptions(
  options: MbscToastOptions,
  destroy?: () => void,
  resolve?: () => void,
  isToast?: boolean,
): MbscPopupOptions {
  return getOptions(
    notificationQueue,
    options,
    {
      animation: options.animation || (isToast ? 'pop' : UNDEFINED),
      buttons: [],
      closeOnOverlayClick: false,
      contentPadding: isToast,
      cssClass:
        'mbsc-' +
        (isToast ? 'toast' : 'snackbar') +
        ' mbsc-' +
        (options.color ? options.color : 'color-none') +
        ' ' +
        (options.cssClass || ''),
      display: options.display || 'bottom',
      focusOnClose: false,
      focusOnOpen: false,
      focusTrap: false,
      onOpen: (ev, inst) => {
        handleOpen(options, inst);
      },
      scrollLock: false,
      setActive: false,
      showOverlay: false,
      touchUi: true,
    },
    destroy,
    resolve,
  );
}

function handleClose(options: INotificationOptions<any>, destroy?: () => void, resolve?: (result?: any) => void, result?: any) {
  if (resolve) {
    resolve(result);
  }
  if (options.callback) {
    options.callback(result);
  }
  if (options.onClose) {
    options.onClose(result);
  }
  // Show next
  if (popupQueue.length) {
    popupQueue[0].open();
  } else if (notificationQueue.length) {
    // Prevent focus on show for notifications
    notificationQueue[0].open();
  }
  if (destroy) {
    destroy();
  }
}

function handleOpen(options: MbscToastOptions, inst: PopupBase) {
  if (options.duration !== false) {
    setTimeout(() => {
      inst.close();
    }, (options.duration as number) || 3000);
  }
}

/**
 * Returns the options for the toast notification popup.
 * @param options Toast options.
 * @param destroy Destroy function to be called on close.
 * @param resolve Promise resolve function to be called on close.
 * @param getValue A function which returns the input value on close, if the Ok button was clicked.
 */
export function getToastOptions(options: MbscToastOptions, destroy?: () => void, resolve?: () => void): MbscPopupOptions {
  return getToastSnackbarOptions(options, destroy, resolve, true);
}

/**
 * Returns the options for the snackbar notification popup.
 * @param options Snackbar options.
 * @param destroy Destroy function to be called on close.
 * @param resolve Promise resolve function to be called on close.
 */
export function getSnackbarOptions(options: MbscSnackbarOptions, destroy?: () => void, resolve?: () => void): MbscPopupOptions {
  return getToastSnackbarOptions(options, destroy, resolve, false);
}

/**
 * Returns the options for the alert dialog.
 * @param options Alert options.
 * @param destroy Destroy function to be called on close.
 * @param resolve Promise resolve function to be called on close.
 */
export function getAlertOptions(options: MbscAlertOptions, destroy?: () => void, resolve?: () => void): MbscPopupOptions {
  return getOptions(
    popupQueue,
    options,
    {
      buttons: ['ok'],
      cssClass: 'mbsc-alert ' + (options.cssClass || ''),
      okText: options.okText || 'OK',
    },
    destroy,
    resolve,
  );
}

/**
 * Returns the options for the confirm dialog.
 * @param options Confirm options.
 * @param destroy Destroy function to be called on close.
 * @param resolve Promise resolve function to be called on close.
 */
export function getConfirmOptions(
  options: MbscConfirmOptions,
  destroy?: () => void,
  resolve?: (result: boolean) => void,
): MbscPopupOptions {
  let result = false;
  return getOptions(
    popupQueue,
    options,
    {
      buttons: ['cancel', 'ok'],
      cancelText: options.cancelText || 'Cancel',
      cssClass: 'mbsc-alert mbsc-confirm ' + (options.cssClass || ''),
      okText: options.okText || 'OK',
      onButtonClick: (ev: any) => {
        if (ev.button.name === 'ok') {
          result = true;
        }
      },
      onClosed: () => {
        handleClose(options, destroy, resolve, result);
      },
    },
    destroy,
    resolve,
  );
}

/**
 * Returns the options for the prompt dialog.
 * @param options Prompt options.
 * @param destroy Destroy function to be called on close.
 * @param resolve Promise resolve function to be called on close.
 * @param getValue A function which returns the input value on close, if the Ok button was clicked.
 */
export function getPromptOptions(
  options: MbscPromptOptions,
  destroy?: () => void,
  resolve?: (result: string | null) => void,
  getValue?: () => string,
  resetValue?: () => void,
): MbscPopupOptions {
  let okClicked: boolean;
  return getOptions(
    popupQueue,
    options,
    {
      activeElm: 'input',
      buttons: ['cancel', 'ok'],
      cancelText: options.cancelText || 'Cancel',
      cssClass: 'mbsc-alert mbsc-prompt ' + (options.cssClass || ''),
      okText: options.okText || 'OK',
      onButtonClick: (ev: any) => {
        if (ev.button.name === 'ok') {
          okClicked = true;
        }
      },
      onClosed: () => {
        handleClose(options, destroy, resolve, okClicked && getValue ? getValue() : null);
        if (resetValue) {
          setTimeout(() => {
            resetValue();
          });
        }
      },
    },
    destroy,
    resolve,
  );
}

/**
 * Shows an alert, confirm or prompt dialog.
 * If there's already one visible, puts in the queue.
 * @param popup
 */
export function showModal(popup: PopupBase) {
  if (!popupQueue.length) {
    popup.open();
  }
  popupQueue.push(popup);
}

/**
 * Shows a toast or snackbar.
 * If there's an alert, confirm or prompt visible, puts it in the queue.
 * If there's another toast or snackbar visible, hides the visible one and will show this one.
 * @param notification
 */
export function showNotification(notification: PopupBase) {
  const activeNotification = notificationQueue[0];
  notificationQueue.push(notification);
  // Only show notification if no popup is visible
  // otherwise postpone it until popup is closed
  if (!popupQueue.length) {
    // If there's a visible notification, hide it.
    // The notification will be shown after hide animation is complete
    if (activeNotification) {
      activeNotification.close();
    } else {
      // Prevent focus on show for notifications
      notification.open();
    }
  }
}

/**
 * Routes a function through a promise if promises are supported,
 * otherwise calls the function directly
 * @param func The function to call.
 * @param options Notification config object.
 */
export function promise<T>(
  func: (options: INotificationOptions<any>, resolve: (result?: any) => void) => void,
  options: INotificationOptions<any>,
): Promise<T> {
  let p: Promise<T>;
  if (hasPromise) {
    p = new Promise((resolve) => {
      func(options, resolve);
    });
  } else {
    func(options, noop);
  }
  return p!;
}
