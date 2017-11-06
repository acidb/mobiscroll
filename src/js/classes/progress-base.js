import { $, Base } from '../core/core';
import { noop } from '../util/misc';

var ProgressBase = function (elm, settings, inherit) {
    var $elm,
        $parent,
        cssClass,
        s,
        that = this;

    // Call the parent constructor
    Base.call(this, elm, settings, true);

    that.__init = noop;

    that.__destroy = noop;

    that._init = function (ss) {

        var wasInit;

        s = that.settings;

        $elm = $(elm);

        // Check if the element was already initialized
        wasInit = !!$parent;

        $parent = $elm.parent();
        $parent = $parent.hasClass('mbsc-input-wrap') ? $parent.parent() : $parent;

        that._$parent = $parent;

        if (cssClass) {
            $parent.removeClass(cssClass);
        }

        cssClass = that._css + ' mbsc-progress-w mbsc-control-w mbsc-' + s.theme + (s.baseTheme ? ' mbsc-' + s.baseTheme : '') + (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr');

        $parent.addClass(cssClass);

        $elm.addClass('mbsc-control');

        that.__init(ss);

        if (!wasInit) {
            that._attachChange();
        }

        // Show initial value
        that.refresh();
    };

    that._destroy = function () {

        that.__destroy();

        $parent.removeClass(cssClass);

        $elm.removeClass('mbsc-control');
    };

    if (!inherit) {
        that.init(settings);
    }
};

ProgressBase.prototype = {
    _class: 'progressbase'
};

export default ProgressBase;
