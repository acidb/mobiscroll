import { $, Base } from '../core/core';
import { noop } from '../util/misc';
import { getCssClass } from './form-control';

export const ProgressBase = function (elm, settings, inherit) {
    var $elm,
        $parent,
        cssClass,
        s,
        that = this;

    // Call the parent constructor
    Base.call(this, elm, settings, true);

    that.__init = noop;

    that.__destroy = noop;

    that._init = function () {

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

        cssClass = that._css + ' mbsc-progress-w mbsc-control-w ' + getCssClass(s);

        $parent.addClass(cssClass);

        $elm.addClass('mbsc-control');

        that.__init();

        if (!wasInit) {
            that._attachChange();
        }

        // Show initial value
        that.refresh();

        elm.mbscInst = that;
    };

    that._destroy = function () {

        that.__destroy();

        $parent.removeClass(cssClass);

        $elm.removeClass('mbsc-control');

        delete elm.mbscInst;
    };

    if (!inherit) {
        that.init();
    }
};
