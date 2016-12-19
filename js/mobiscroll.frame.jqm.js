(function () {

    var ms = mobiscroll,
        $ = ms.$;

    ms.themes.frame.jqm = {
        jqmBody: 'a',
        jqmBorder: 'a',
        //jqmHeader: 'b',
        //jqmWheel: 'd',
        jqmLine: 'b',
        //jqmClickPick: 'c',
        jqmSet: 'b',
        jqmCancel: 'c',
        disabledClass: 'ui-disabled',
        activeClass: 'ui-btn-active',
        activeTabInnerClass: 'ui-btn-active',
        onInit: function () {
            $(this).closest('.ui-field-contain').trigger('create');
        },
        onMarkupInserted: function (ev, inst) {
            var s = inst.settings,
                elm = $(ev.target);

            $('.mbsc-np-btn, .mbsc-cal-sc-m-cell .mbsc-cal-sc-cell-i', elm).addClass('ui-btn');
            $('.mbsc-fr-btn-cont .mbsc-fr-btn, .mbsc-range-btn', elm).addClass('ui-btn ui-mini ui-corner-all');
            $('.mbsc-cal-prev .mbsc-cal-btn-txt', elm).addClass('ui-btn ui-icon-arrow-l ui-btn-icon-notext ui-shadow ui-corner-all');
            $('.mbsc-cal-next .mbsc-cal-btn-txt', elm).addClass('ui-btn ui-icon-arrow-r ui-btn-icon-notext ui-shadow ui-corner-all');

            $('.mbsc-fr-popup', elm).removeClass('dwbg').addClass('ui-selectmenu ui-overlay-shadow ui-corner-all ui-body-' + s.jqmBorder);
            $('.mbsc-fr-btn-s .mbsc-fr-btn', elm).addClass('ui-btn-' + s.jqmSet);
            $('.mbsc-fr-hdr', elm).addClass('ui-header ui-bar-inherit');
            $('.mbsc-fr-w', elm).addClass('ui-corner-all ui-body-' + s.jqmBody);
            // Scroller
            $('.mbsc-sc-btn', elm).addClass('ui-btn ui-mini ui-corner-all ui-btn-icon-top');
            $('.mbsc-sc-btn-plus', elm).addClass('ui-icon-carat-d');
            $('.mbsc-sc-btn-minus', elm).addClass('ui-icon-carat-u');
            //$('.mbsc-sc-whl', elm).addClass('ui-body-' + s.jqmWheel);
            $('.mbsc-sc-whl-l', elm).addClass('ui-body-' + s.jqmLine);
            // Calendar base
            $('.mbsc-cal-tabs', elm).attr('data-role', 'navbar');
            $('.mbsc-cal-prev .mbsc-cal-btn-txt', elm).attr('data-role', 'button').attr('data-icon', 'arrow-l').attr('data-iconpos', 'notext');
            $('.mbsc-cal-next .mbsc-cal-btn-txt', elm).attr('data-role', 'button').attr('data-icon', 'arrow-r').attr('data-iconpos', 'notext');
            // Calendar events
            $('.mbsc-cal-events', elm).attr('data-role', 'page');
            // Rangepicker
            $('.mbsc-range-btn', elm).attr('data-role', 'button').attr('data-mini', 'true');
            // Numpad
            $('.mbsc-np-btn', elm).attr('data-role', 'button').attr('data-corners', 'false');
            elm.trigger('create');
        }
    };

    ms.themes.scroller.jqm = $.extend({}, ms.themes.frame.jqm, {
        dateDisplay: 'Mddyy',
        onEventBubbleShow: function (ev) {
            $('.mbsc-cal-event-list', ev.eventList).attr('data-role', 'listview');
            $(ev.eventList).page().trigger('create');
        },
        btnCalPrevClass: '',
        btnCalNextClass: '',
        selectedLineHeight: true,
        selectedLineBorder: 1,
        checkIcon: 'none ui-btn-icon-left ui-icon-check',
        onThemeLoad: function (ev) {
            var s = ev.settings,
                cal = s.jqmBody || 'c',
                bubble = s.jqmEventBubble || 'a';

            s.dayClass = 'ui-body-a ui-body-' + cal;
            s.innerDayClass = 'ui-state-default ui-btn ui-btn-up-' + cal;
            s.calendarClass = 'ui-body-a ui-body-' + cal;
            s.weekNrClass = 'ui-body-a ui-body-' + cal;
            s.eventBubbleClass = 'ui-body-' + bubble;
        }
    });

})();
