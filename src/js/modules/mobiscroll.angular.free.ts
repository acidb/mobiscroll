import { NgModule, FormsModule, CommonModule, mobiscroll } from '../frameworks/angular';

import { MbscForm, MbscInput, MbscDropdown, MbscTextarea, MbscButton, MbscCheckbox, MbscSwitch, MbscStepper, MbscProgress, MbscSlider, MbscRadio, MbscRadioGroup, MbscSegmentedGroup, MbscSegmented } from '../forms.angular';
import { MbscPage } from '../page.angular';
import { MbscScroller } from '../scroller.angular';


const directives = [
    MbscScroller, MbscForm, MbscPage, MbscInput, MbscDropdown, MbscTextarea, MbscButton, MbscCheckbox, MbscSwitch, MbscStepper, MbscProgress, MbscSlider, MbscRadio, MbscRadioGroup, MbscSegmentedGroup, MbscSegmented,
];

@NgModule({
    imports: [FormsModule, CommonModule],
    declarations: [directives],
    exports: [directives]
})
class MbscModule { };

export {
    mobiscroll,
    MbscModule
}