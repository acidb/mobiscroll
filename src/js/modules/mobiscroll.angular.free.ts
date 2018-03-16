import { NgModule, FormsModule, CommonModule, mobiscroll } from '../frameworks/angular';

import { MbscForm, MbscRating, MbscInput, MbscDropdown, MbscTextarea, MbscButton, MbscCheckbox, MbscSwitch, MbscStepper, MbscProgress, MbscSlider, MbscRadio, MbscRadioGroup, MbscSegmentedGroup, MbscSegmented, MbscFormOptions } from '../forms.angular';
import { MbscPage, MbscPageOptions, MbscNote, MbscAvatar } from '../page.angular';

const directives = [
    MbscForm, MbscRating, MbscPage, MbscNote, MbscAvatar, MbscInput, MbscDropdown, MbscTextarea, MbscButton, MbscCheckbox, MbscSwitch, MbscStepper, MbscProgress, MbscSlider, MbscRadio, MbscRadioGroup, MbscSegmentedGroup, MbscSegmented
];

@NgModule({
    imports: [FormsModule, CommonModule],
    declarations: [directives],
    exports: [directives]
})
class MbscModule { };

export {
    mobiscroll,
    MbscForm, MbscRating, MbscPage, MbscNote, MbscAvatar, MbscInput, MbscDropdown, MbscTextarea, MbscButton, MbscCheckbox, MbscSwitch, MbscStepper, MbscProgress, MbscSlider, MbscRadio, MbscRadioGroup, MbscSegmentedGroup, MbscSegmented,
    MbscPageOptions,
    MbscModule
}