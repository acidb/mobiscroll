export * from './notifications.types.public';

export interface INotificationOptions<T> {
  /**
   * Animation to use when the component is opened or closed.
   * @defaultValue undefined
   */
  animation?: 'pop' | 'slide-down' | 'slide-up' | boolean;
  /**
   * Specifies a custom CSS class for the component.
   * @defaultValue undefined
   */
  cssClass?: string;
  /**
   * Controls the positioning of the component.
   * @defaultValue undefined
   */
  display?: 'bottom' | 'center' | 'top';
  /**
   * {@inheritDoc MbscPopupOptions.isOpen}
   * @defaultValue undefined
   */
  isOpen?: boolean;
  /**
   * Message to present.
   */
  message?: string;
  /**
   * {@inheritDoc MbscPopupOptions.theme}
   * @defaultValue undefined
   */
  theme?: string;
  /**
   * {@inheritDoc MbscPopupOptions.themeVariant}
   * @defaultValue undefined
   */
  themeVariant?: 'auto' | 'light' | 'dark';

  /** @hidden */
  callback?: (result: T) => void;
  /** @hidden */
  context?: string;

  /**
   * @event
   * Triggered when the component is closed.
   */
  onClose?: (result: T) => void;
}
