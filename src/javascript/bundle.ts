export * from '../core/bundle';
export * from './components/forms';
export * from './components/popup';

import { registerComponent } from './base';
import { Button, Checkbox, Dropdown, Input, Page, Radio, Segmented, SegmentedGroup, Stepper, Switch, Textarea } from './components/forms';

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

export { registerComponent };
export { enhance, getInst } from '@framework/renderer';
