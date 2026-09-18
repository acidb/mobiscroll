import { registerComponent } from './base';
import { Button, Checkbox, Dropdown, Input, Page, Radio, Segmented, SegmentedGroup, Stepper, Switch, Textarea } from './components/forms';
import {
  MbscButtonOptions,
  MbscCheckboxOptions,
  MbscInputOptions,
  MbscPageOptions,
  MbscRadioOptions,
  MbscSegmentedOptions,
  MbscStepperOptions,
  MbscSwitchOptions,
} from './components/forms';
import { Popup } from './components/popup';
import { MbscPopupOptions } from './components/popup';

export * from '../core/bundle';
export * from './components/forms';
export * from './components/popup';

registerComponent(Button);
registerComponent(Checkbox);
registerComponent(Input);
registerComponent(Dropdown);
registerComponent(Textarea);
registerComponent(Page);
registerComponent(Radio);
registerComponent(Segmented);
registerComponent(SegmentedGroup);
registerComponent(Stepper);
registerComponent(Switch);
registerComponent(Popup);

export { registerComponent };
export { enhance, getInst } from '@framework/renderer';

declare global {
  interface MobiscrollBundle {
    [index: number]: JQuery;

    popup(options?: MbscPopupOptions): JQuery;
    // Form components
    button(options?: MbscButtonOptions): JQuery;
    checkbox(options?: MbscCheckboxOptions): JQuery;
    input(options?: MbscInputOptions): JQuery;
    dropdown(options?: MbscInputOptions): JQuery;
    textarea(options?: MbscInputOptions): JQuery;
    page(options?: MbscPageOptions): JQuery;
    radio(options?: MbscRadioOptions): JQuery;
    segmented(options?: MbscSegmentedOptions): JQuery;
    stepper(options?: MbscStepperOptions): JQuery;
    switch(options?: MbscSwitchOptions): JQuery;
  }

  interface JQuery {
    mobiscroll(): MobiscrollBundle;
    mobiscroll(option: string, ...params: any[]): any;
  }
}
