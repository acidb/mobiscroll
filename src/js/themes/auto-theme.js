import { $, mobiscroll } from '../core/core';
import { os } from '../util/platform';

const themes = mobiscroll.themes;

let theme;

if (os == 'android') {
    theme = 'material';
} else if (os == 'ios') {
    theme = 'ios';
} else if (os == 'wp') {
    theme = 'windows';
}

$.each(themes.frame, function (key, settings) {
    // Stop at the first custom theme with the OS base theme
    if (theme && settings.baseTheme == theme && key != 'material-dark' && key != 'windows-dark' && key != 'ios-dark') {
        mobiscroll.autoTheme = key;
        return false;
    } else if (key == theme) {
        mobiscroll.autoTheme = key;
    }
});
