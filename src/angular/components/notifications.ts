/* @mbsc-ivy-start */
import { ApplicationRef, ComponentRef, Injectable, Injector, NgModule, ViewContainerRef } from '@angular/core';
/* @mbsc-ivy-end */
/* @mbsc-legacy-start
import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, NgModule } from '@angular/core';
@mbsc-legacy-end */
import {
  getAlertOptions,
  getConfirmOptions,
  getPromptOptions,
  getSnackbarOptions,
  getToastOptions,
  promise,
  showModal,
  showNotification,
} from '../../core/components/notifications/notifications';
import {
  INotificationOptions,
  MbscAlertOptions,
  MbscConfirmOptions,
  MbscPromptOptions,
  MbscSnackbarOptions,
  MbscToastOptions,
} from '../../core/components/notifications/notifications.types';
import { MbscPopupOptions } from '../../core/components/popup/popup.types.public';
import { doc } from '../../core/util/dom';
import { UNDEFINED } from '../../core/util/misc';
import { MbscInputModule } from './input.module';
import { MbscPopup } from './popup';
import { MbscPopupModule } from './popup.module';
import { MbscPrompt } from './prompt';
import { MbscSnackbar } from './snackbar';

export { MbscPrompt, MbscSnackbar };

// Types
export * from '../../core/components/notifications/notifications.types.public';

interface INotification {
  props: MbscPopupOptions;
}

function getAlertElm(options: MbscAlertOptions | MbscConfirmOptions): HTMLDivElement {
  const elm = doc!.createElement('div');
  elm.className = 'mbsc-alert-content';
  elm.innerHTML = '<h2 class="mbsc-alert-title">' + options.title + '</h2><p class="mbsc-alert-message">' + options.message + '</p>';
  return elm;
}

@Injectable()
export class Notifications {
  constructor(private _injector: Injector, private _app: ApplicationRef) {}

  public toast(options: MbscToastOptions): Promise<undefined> {
    return promise(this._showToast, options);
  }

  public snackbar(options: MbscSnackbarOptions): Promise<undefined> {
    return promise(this._showSnackbar, options);
  }

  public alert(options: MbscAlertOptions): Promise<undefined> {
    return promise(this._showAlert, options);
  }

  public confirm(options: MbscConfirmOptions): Promise<boolean> {
    return promise(this._showConfirm, options);
  }

  public prompt(options: MbscPromptOptions): Promise<string | null> {
    return promise(this._showPrompt, options);
  }

  private _createPopup<T extends INotification>(
    Comp: new (...args: any[]) => T,
    options: INotificationOptions<any>,
    getPopupOptions: (
      options: INotificationOptions<any>,
      destroy: () => void,
      resolve: () => void,
      getValue?: () => string,
    ) => MbscPopupOptions,
    resolve: (result?: any) => void,
    body?: HTMLElement,
    getValue?: () => string,
  ): T {
    /* @mbsc-ivy-start */
    const vcr = this._app.components[0].injector.get<ViewContainerRef>(ViewContainerRef);
    const ref = vcr.createComponent(Comp as any, {
      injector: this._injector,
      projectableNodes: body ? [[body]] : undefined,
    }) as ComponentRef<T>;
    /* @mbsc-ivy-end */
    /* @mbsc-legacy-start
    const cfr = this._injector.get<ComponentFactoryResolver>(ComponentFactoryResolver as any);
    const componentFactory = cfr.resolveComponentFactory<T>(Comp);
    const host = doc!.createElement('div');
    const ref = componentFactory.create(this._injector, [[body]], host);
    @mbsc-legacy-end */
    const instance = ref.instance;
    const destroy = () => {
      ref.destroy();
    };

    instance.props = getPopupOptions(options, destroy, resolve, getValue);

    /* @mbsc-legacy-start
    // Attach the component to the view
    this._app.attachView(ref.hostView);
    @mbsc-legacy-end */

    return instance;
  }

  private _showToast = (options: MbscToastOptions, resolve: () => void) => {
    const elm = doc!.createElement('div');
    elm.className = 'mbsc-toast-background mbsc-toast-message';
    elm.innerText = options.message!;
    const instance = this._createPopup(MbscPopup, options, getToastOptions, resolve, elm);
    showNotification(instance);
  };

  private _showSnackbar = (options: MbscSnackbarOptions, resolve: () => void) => {
    const instance = this._createPopup(MbscSnackbar, options, getSnackbarOptions, resolve);
    instance.button = options.button;
    instance.message = options.message!;
    // Settimeout needed for popup ref to be ready
    setTimeout(() => {
      showNotification(instance.popup);
    });
  };

  private _showAlert = (options: MbscAlertOptions, resolve: () => void) => {
    const elm = getAlertElm(options);
    const instance = this._createPopup(MbscPopup, options, getAlertOptions, resolve, elm);
    showModal(instance);
  };

  private _showConfirm = (options: MbscConfirmOptions, resolve: (result: boolean) => void) => {
    const elm = getAlertElm(options);
    const instance = this._createPopup(MbscPopup, options, getConfirmOptions, resolve, elm);
    showModal(instance);
  };

  private _showPrompt = (options: MbscPromptOptions, resolve: (result: string | null) => void) => {
    const instance: MbscPrompt = this._createPopup(MbscPrompt, options, getPromptOptions, resolve, UNDEFINED, () => instance.value);
    instance.inputType = options.inputType;
    instance.label = options.label;
    instance.message = options.message;
    instance.placeholder = options.placeholder;
    instance.title = options.title;
    // Settimeout needed for popup ref to be ready
    setTimeout(() => {
      showModal(instance.popup);
    });
  };
}

@NgModule({
  imports: [MbscInputModule, MbscPopupModule],
  providers: [Notifications],
})
export class MbscNotificationsModule {}
