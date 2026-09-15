import { INotificationOptions } from './notifications.types';

export interface MbscAlertOptions extends INotificationOptions<undefined> {
  /**
   * Text for the button which closes the dialog.
   * @defaultValue 'OK'
   * @group Localizations
   */
  okText?: string;
  /**
   * Title for the dialog.
   * @defaultValue undefined
   */
  title?: string;
}

export interface MbscConfirmOptions extends INotificationOptions<boolean> {
  /**
   * Text for the button which cancels the dialog.
   * @defaultValue 'Cancel'
   * @group Localizations
   */
  cancelText?: string;
  /**
   * {@inheritDoc MbscAlertOptions.okText}
   * @defaultValue 'OK'
   * @group Localizations
   */
  okText?: string;
  /**
   * {@inheritDoc MbscAlertOptions.title}
   * @defaultValue undefined
   */
  title?: string;
}

export interface MbscPromptOptions extends INotificationOptions<string | null> {
  /**
   * {@inheritDoc MbscConfirmOptions.cancelText}
   * @defaultValue 'Cancel'
   * @group Localizations
   */
  cancelText?: string;
  /**
   * Initial value of the displayed input.
   * @defaultValue undefined
   */
  inputType?: string;
  /**
   * Label for the displayed input.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * {@inheritDoc MbscAlertOptions.okText}
   * @defaultValue 'OK'
   * @group Localizations
   */
  okText?: string;
  /**
   * Placeholder text for the displayed input.
   * @defaultValue undefined
   */
  placeholder?: string;
  /**
   * {@inheritDoc MbscAlertOptions.title}
   * @defaultValue undefined
   */
  title?: string;
  /**
   * Initial value of the displayed input.
   * @defaultValue undefined
   */
  value?: string;
}

export interface MbscToastOptions extends INotificationOptions<undefined> {
  /**
   * Specifies the predefined background color of the message, each serving its own semantic purpose.
   * @defaultValue undefined
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  /**
   * Specifies the display time of the message in milliseconds. If `false`, the message will be persistent.
   * @defaultValue 3000
   */
  duration?: boolean | number;
}

export interface MbscSnackbarOptions extends MbscToastOptions {
  /**
   * Displays an action button on the snackbar. Properties:
   * - `text`: *string* - Text of the button.
   * - `icon`: *string* - Icon of the button.
   * - `action`: *() => void* - A function which executes when the button is clicked.
   */
  button?: {
    icon?: string;
    text?: string;
    action?: () => void;
  };
}
