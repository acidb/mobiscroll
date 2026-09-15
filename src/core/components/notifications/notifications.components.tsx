/** @jsxRuntime classic */
/** @jsx createElement */
import { createElement, PureComponent } from '@framework/renderer';
import { UNDEFINED } from '../../util/misc';
import { Popup } from '../popup/popup.common';
import {
  getAlertOptions,
  getConfirmOptions,
  getPromptOptions,
  getSnackbarOptions,
  getToastOptions,
  showModal,
  showNotification,
} from './notifications';
import { getAlertContent, getPromptContent, getSnackbarContent, getToastContent } from './notifications.common';
import {
  INotificationOptions,
  MbscAlertOptions,
  MbscConfirmOptions,
  MbscPromptOptions,
  MbscSnackbarOptions,
  MbscToastOptions,
} from './notifications.types';

class NotificationBase<T extends INotificationOptions<R>, R> extends PureComponent<T> {
  protected _popup?: Popup;

  public open = () => {
    if (this._popup) {
      showModal(this._popup);
    }
  };

  public close = () => {
    if (this._popup) {
      this._popup.close();
    }
  };

  public componentDidUpdate(prevS: any) {
    const s = this.props;
    if (prevS.isOpen !== s.isOpen) {
      if (s.isOpen) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  protected _setRef = (ref: Popup) => {
    this._popup = ref;
  };
}

export class Alert extends NotificationBase<MbscAlertOptions, any> {
  public render() {
    const s = this.props;
    const opts = getAlertOptions(s);
    return (
      <Popup ref={this._setRef} {...opts}>
        {getAlertContent(s)}
      </Popup>
    );
  }
}

export class Confirm extends NotificationBase<MbscConfirmOptions, boolean> {
  public render() {
    const s = this.props;
    const opts = getConfirmOptions(s);
    return (
      <Popup ref={this._setRef} {...opts}>
        {getAlertContent(s)}
      </Popup>
    );
  }
}

export class Prompt extends NotificationBase<MbscPromptOptions, string | null> {
  protected _value = this.props.value || '';

  public render() {
    const s = this.props;
    const getVal = () => this._value;
    const resetVal = () => {
      this._value = this.props.value || '';
    };
    const opts = getPromptOptions(s, UNDEFINED, UNDEFINED, getVal, resetVal);
    return (
      <Popup ref={this._setRef} {...opts}>
        {getPromptContent(
          s,
          (event: any) => {
            this._value = event.target.value;
          },
          getVal,
        )}
      </Popup>
    );
  }
}

export class Toast extends NotificationBase<MbscToastOptions, any> {
  public open = () => {
    if (this._popup) {
      showNotification(this._popup);
    }
  };

  public render() {
    const s = this.props;
    const opts = getToastOptions(s);
    return (
      <Popup ref={this._setRef} {...opts}>
        {getToastContent(s)}
      </Popup>
    );
  }
}

export class Snackbar extends NotificationBase<MbscSnackbarOptions, any> {
  public open = () => {
    if (this._popup) {
      showNotification(this._popup);
    }
  };

  public render() {
    const s = this.props;
    const opts = getSnackbarOptions(s);
    return (
      <Popup ref={this._setRef} {...opts}>
        {getSnackbarContent(s, this._onButtonClick)}
      </Popup>
    );
  }

  protected _onButtonClick = () => {
    const s = this.props;
    this.close();

    if (s.button && s.button.action) {
      s.button.action();
    }
  };
}
