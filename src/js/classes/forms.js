import { $, Base, mobiscroll, classes, autoInit } from '../core/core';
import { hasTouchAction } from '../util/dom';
import { os, majorVersion } from '../util/platform';
import { initControls } from '../util/forms';
import '../util/notifications';

const halfBorder = os == 'ios' && majorVersion > 7;

export const Form = function (el, settings) {

    var s,
        cssClass = '',
        $ctx = $(el),
        controls = {},
        that = this;

    function touched() {
        $ctx.removeClass('mbsc-no-touch');
    }

    // Call the parent constructor
    Base.call(this, el, settings, true);

    that.refresh = function (shallow) {
        initControls($ctx, controls, s, shallow);
    };

    /**
     * Form initialization.
     */
    that._init = function () {
        if (!mobiscroll.themes.form[s.theme]) {
            s.theme = 'mobiscroll';
        }

        if (!$ctx.hasClass('mbsc-form')) {
            $ctx.on('touchstart', touched).show();
        }

        if (cssClass) {
            $ctx.removeClass(cssClass);
        }

        // --- TRIAL SERVER CODE START ---
        cssClass = 'mbsc-form mbsc-no-touch mbsc-' + s.theme +
            (halfBorder ? ' mbsc-form-hb' : '') +
            (s.baseTheme ? ' mbsc-' + s.baseTheme : '') +
            (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr');
        // --- TRIAL SERVER CODE END ---

        $ctx.addClass(cssClass).removeClass('mbsc-cloak');

        that.refresh();
    };

    /**
     * Destroys the mobiscroll instance.
     */
    that._destroy = function () {
        $ctx.removeClass(cssClass).off('touchstart', touched);

        for (var id in controls) {
            controls[id].destroy();
        }
    };

    /**
     * Object with the underlying form control instances
     * keys are the element id's
     */
    that.controls = controls;

    // Constructor

    s = that.settings;

    that.init();
};

// Extend defaults
Form.prototype = {
    _hasDef: true,
    _hasTheme: true,
    _hasLang: true,
    _class: 'form',
    _defaults: {
        tap: !hasTouchAction,
        stopProp: true,
        // Localization
        lang: 'en'
    }
};

mobiscroll.themes.form.mobiscroll = {};

classes.Form = Form;

// Init mbsc-form elements on page load
autoInit('[mbsc-enhance],[mbsc-form]', Form, true);
