import mobiscroll, { $, isBrowser, Base } from '../core/core';

var classes = mobiscroll.classes;

// Page
// ---

const Page = function (el, settings) {
    var cssClass = '',
        $elm = $(el),
        that = this,
        s = that.settings;

    // Call the parent constructor
    Base.call(this, el, settings, true);

    /**
     * Page initialization.
     */
    that._init = function () {
        var ctx = s.context,
            $ctx = $(ctx),
            $topMenu = $ctx.find('.mbsc-ms-top .mbsc-ms'),
            $bottomMenu = $ctx.find('.mbsc-ms-bottom .mbsc-ms'),
            css = {};

        if (ctx == 'body') {
            $('body,html').addClass('mbsc-page-ctx');
        } else {
            $ctx.addClass('mbsc-page-ctx');
        }

        if (cssClass) {
            $elm.removeClass(cssClass);
        }

        if ($topMenu.length) {
            css.paddingTop = $topMenu[0].offsetHeight;
        }

        if ($bottomMenu.length) {
            css.paddingBottom = $bottomMenu[0].offsetHeight;
        }

        cssClass = 'mbsc-page mbsc-' + s.theme + (s.baseTheme ? ' mbsc-' + s.baseTheme : '') + (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr');

        $elm.addClass(cssClass).css(css);
    };

    /**
     * Destroys the mobiscroll instance.
     */
    that._destroy = function () {
        $elm.removeClass(cssClass);
    };

    // Constructor

    s = that.settings;

    that.init(settings);
};

// Extend defaults
Page.prototype = {
    _hasDef: true,
    _hasTheme: true,
    _hasLang: true,
    _class: 'page',
    _defaults: {
        context: 'body'
    }
};

classes.Page = Page;

mobiscroll.themes.page.mobiscroll = {};

mobiscroll.presetShort('page', 'Page');

// ---
// Page end

// Init mbsc-page elements on page load or when mbsc-enhance event is triggeres
// ---

if (isBrowser) {
    $(function () {

        var selector = '[mbsc-page]';

        $(selector).each(function () {
            new classes.Page(this);
        });

        $(document).on('mbsc-enhance', function (ev, settings) {
            if ($(ev.target).is(selector)) {
                new classes.Page(ev.target, settings);
            } else {
                $(selector, ev.target).each(function () {
                    new classes.Page(this, settings);
                });
            }
        });
    });
}

// ---
// Init end

export default Page;
