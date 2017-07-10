import mobiscroll, {
    $
} from '../core/core';
import {
    os,
    majorVersion
} from '../util/platform';

export default mobiscroll;

const themes = mobiscroll.themes;

let theme;

if (os == 'android') {
    theme = majorVersion >= 5 ? 'material' : 'android-holo';
} else if (os == 'ios') {
    theme = 'ios';
} else if (os == 'wp') {
    theme = 'wp';
}

mobiscroll.setAutoTheme = function () {
    $.each(themes.frame, function (key, settings) {
        // Stop at the first custom theme with the OS base theme
        if (theme && settings.baseTheme == theme && key != 'android-holo-light' && key != 'material-dark' && key != 'wp-light' && key != 'ios-dark') {
            mobiscroll.autoTheme = key;
            return false;
        } else if (key == theme) {
            mobiscroll.autoTheme = key;
        }
    });
};

mobiscroll.setAutoTheme();
