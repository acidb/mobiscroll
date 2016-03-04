(function ($) {

    $.mobiscroll.themes.frame.jqm = {
        jqmBody: 'a',
        jqmBorder: 'a',
        jqmHeader: 'b',
        jqmWheel: 'd',
        jqmLine: 'b',
        jqmClickPick: 'c',
        jqmSet: 'b',
        jqmCancel: 'c',
        disabledClass: 'ui-disabled',
        activeClass: 'ui-btn-active',
        activeTabInnerClass: 'ui-btn-active',
        btnCalPrevClass: '',
        btnCalNextClass: '',
        selectedLineHeight: true,
        selectedLineBorder: 1,
        checkIcon: 'none ui-btn-icon-left ui-icon-check',
        onThemeLoad: function (lang, s) {
            var cal = s.jqmBody || 'c',
                txt = s.jqmEventText || 'b',
                bubble = s.jqmEventBubble || 'a';

            s.dayClass = 'ui-body-a ui-body-' + cal;
            s.innerDayClass = 'ui-state-default ui-btn ui-btn-up-' + cal;
            s.calendarClass = 'ui-body-a ui-body-' + cal;
            s.weekNrClass = 'ui-body-a ui-body-' + cal;
            s.eventTextClass = 'ui-btn-up-' + txt;
            s.eventBubbleClass = 'ui-body-' + bubble;
        },
        onEventBubbleShow: function (evd, evc) {
            $('.dw-cal-event-list', evc).attr('data-role', 'listview');
            evc.page().trigger('create');
        },
        onMarkupInserted: function (elm, inst) {
            var s = inst.settings;

            //elm.addClass('mbsc-jqm14');
            $('.mbsc-np-btn, .dwwb, .dw-cal-sc-m-cell .dw-i', elm).addClass('ui-btn');
            $('.dwbc .dwb, .dw-dr', elm).addClass('ui-btn ui-mini ui-corner-all');
            $('.dw-cal-prev .dw-cal-btn-txt', elm).addClass('ui-btn ui-icon-arrow-l ui-btn-icon-notext ui-shadow ui-corner-all');
            $('.dw-cal-next .dw-cal-btn-txt', elm).addClass('ui-btn ui-icon-arrow-r ui-btn-icon-notext ui-shadow ui-corner-all');

            $('.dw', elm).removeClass('dwbg').addClass('ui-selectmenu ui-overlay-shadow ui-corner-all ui-body-' + s.jqmBorder);
            $('.dwbc .dwb', elm).attr('data-role', 'button').attr('data-mini', 'true').attr('data-theme', s.jqmCancel);
            $('.dwb-s .dwb', elm).addClass('ui-btn-' + s.jqmSet).attr('data-theme', s.jqmSet);
            $('.dwv', elm).addClass('ui-corner-all ui-header ui-bar-' + s.jqmHeader);
            $('.dwwr', elm).addClass('ui-corner-all ui-body-' + s.jqmBody);
            // Scroller
            $('.mbsc-sc-btn', elm).addClass('ui-btn ui-mini ui-corner-all ui-btn-' + s.jqmClickPick);
            $('.mbsc-sc-whl', elm).addClass('ui-body-' + s.jqmWheel);
            $('.mbsc-sc-whl-l', elm).addClass('ui-body-' + s.jqmLine);
            // Calendar base
            $('.dw-cal-tabs', elm).attr('data-role', 'navbar');
            $('.dw-cal-prev .dw-cal-btn-txt', elm).attr('data-role', 'button').attr('data-icon', 'arrow-l').attr('data-iconpos', 'notext');
            $('.dw-cal-next .dw-cal-btn-txt', elm).attr('data-role', 'button').attr('data-icon', 'arrow-r').attr('data-iconpos', 'notext');
            // Calendar events
            $('.dw-cal-events', elm).attr('data-role', 'page');
            // Rangepicker
            $('.dw-dr', elm).attr('data-role', 'button').attr('data-mini', 'true');
            // Numpad
            $('.mbsc-np-btn', elm).attr('data-role', 'button').attr('data-corners', 'false');
            elm.trigger('create');
        }
    };

})(jQuery);
