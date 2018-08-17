import { $, extend, mobiscroll, classes } from '../core/core';
import { Frame } from './frame';

export const Popup = function (el, settings, inherit) {

    function addContent($m) {
        /* TRIAL */

        if (!$('.mbsc-fr-c', $m).hasClass('mbsc-wdg-c') /* TRIALCOND */ ) {
            $('.mbsc-fr-c', $m).addClass('mbsc-wdg-c').append($elm.show());

            if (!$('.mbsc-w-p', $m).length) {
                $('.mbsc-fr-c', $m).addClass('mbsc-w-p');
            }
        }
    }

    var s,
        $prev,
        $elm = $(el),
        that = this;

    // Call the parent constructor
    Frame.call(this, el, settings, true);

    /* TRIALFUNC */

    that._generateContent = function () {
        return '';
    };

    that._markupReady = function ($m) {
        if (s.display != 'inline') {
            addContent($m);
        }
    };

    that._markupInserted = function ($m) {

        if (s.display == 'inline') {
            addContent($m);
        }

        $m.trigger('mbsc-enhance', [{
            theme: s.theme,
            lang: s.lang
        }]);
    };

    that._markupRemove = function () {
        $elm.hide();

        if ($prev && $prev.parent().length) {
            $prev.after($elm);
        }
    };

    that.__processSettings = function () {
        s = that.settings;

        that.buttons.ok = {
            text: s.okText,
            icon: s.okIcon,
            handler: 'set'
        };

        s.buttons = s.buttons || (s.display == 'inline' ? [] : ['ok']);

        if (!$prev && $elm.parent().length) {
            $prev = $(document.createComment('popup'));
            $elm.before($prev);
        }

        $elm.hide();
    };

    // Constructor
    if (!inherit) {
        that.init();
    }
};

Popup.prototype = {
    _hasDef: true,
    _hasTheme: true,
    _hasContent: true,
    _hasLang: true,
    _class: 'popup',
    _defaults: extend({}, Frame.prototype._defaults, {
        compClass: 'mbsc-wdg',
        okText: 'OK',
        headerText: false
    })
};

classes.Popup = Popup;
classes.Widget = Popup;

export const Widget = Popup;

mobiscroll.themes.popup = mobiscroll.themes.frame;
