import mobiscroll, {
    $,
    extend
} from '../core/core';
import Frame from './frame';

const Widget = function (el, settings, inherit) {

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
        $parent,
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

        if ($parent) {
            $parent.prepend($elm);
        } else {
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

        if (!$parent && !$prev) {
            $prev = $elm.prev();

            if (!$prev.length) {
                $parent = $elm.parent();
            }
        }

        $elm.hide();
    };

    that.__init = function () {
        s.cssClass = (s.cssClass || '') + ' mbsc-wdg';
    };

    // Constructor
    if (!inherit) {
        that.init(settings);
    }
};

Widget.prototype = {
    _hasDef: true,
    _hasTheme: true,
    _hasContent: true,
    _hasLang: true,
    _class: 'widget',
    _defaults: extend({}, Frame.prototype._defaults, {
        okText: 'OK',
        headerText: false
    })
};

mobiscroll.classes.Widget = Widget;

mobiscroll.themes.widget = mobiscroll.themes.frame;

mobiscroll.presetShort('widget', 'Widget', false);

export default Widget;
