import { NgModule, FormsModule, CommonModule, mobiscroll } from '../frameworks/angular';

import { MbscForm, MbscInput, MbscDropdown, MbscTextarea, MbscButton, MbscCheckbox, MbscSwitch, MbscStepper, MbscProgress, MbscSlider, MbscRadio, MbscRadioGroup, MbscSegmentedGroup, MbscSegmented, MbscFormOptions } from '../forms.angular';
import { MbscPage, MbscPageOptions } from '../page.angular';
import { MbscScroller } from '../scroller.angular';
import { MbscScrollerOptions } from '../core/core';

const directives = [
    MbscForm, MbscPage, MbscInput, MbscDropdown, MbscTextarea, MbscButton, MbscCheckbox, MbscSwitch, MbscStepper, MbscProgress, MbscSlider, MbscRadio, MbscRadioGroup, MbscSegmentedGroup, MbscSegmented,
    MbscScroller
];

@NgModule({
    imports: [FormsModule, CommonModule],
    declarations: [directives],
    exports: [directives]
})
class MbscModule { };

export {
    mobiscroll,
    MbscScrollerOptions,
    MbscPageOptions,
    MbscModule
}