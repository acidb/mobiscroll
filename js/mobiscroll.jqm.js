(function ($) {

    $.mobiscroll.themes.jqm = {
        defaults: {
            jqmBorder: 'a',
            jqmBody: 'c',
            jqmHeader: 'b',
            jqmWheel: 'd',
            jqmClickPick: 'c',
            jqmSet: 'b',
            jqmCancel: 'c',
            dayClass: ' ui-body-c',
            validDayClass: ' ui-btn-up-c ui-state-default ui-btn',
            disabledClass: ' ui-disabled',
            calendarClass: ' ui-body-c',
            weekNrClass: ' ui-body-a ui-body-c',
            activeDayClass: ' ui-btn-active'
        },
        init: function (elm, inst) {
            var s = inst.settings;
            $('.dw', elm).removeClass('dwbg').addClass('ui-selectmenu ui-overlay-shadow ui-corner-all ui-body-' + s.jqmBorder);
            $('.dwbc .dwb', elm).attr('data-role', 'button').attr('data-mini', 'true').attr('data-theme', s.jqmCancel);
            $('.dwb-s .dwb', elm).attr('data-theme', s.jqmSet);
            $('.dwwb', elm).attr('data-role', 'button').attr('data-theme', s.jqmClickPick);
            $('.dwv', elm).addClass('ui-header ui-bar-' + s.jqmHeader);
            $('.dwwr', elm).addClass('ui-body-' + s.jqmBody);
            $('.dwpm .dwwl', elm).addClass('ui-body-' + s.jqmWheel);
            $('.dwpm .dwl', elm).addClass('ui-body-' + s.jqmBody);
            $('.dw-cal-tabs', elm).attr('data-role', 'navbar');
            $('.dw-cal-prev .dw-cal-btn-txt', elm).attr('data-role', 'button').attr('data-icon', 'arrow-l').attr('data-iconpos','notext');
            $('.dw-cal-next .dw-cal-btn-txt', elm).attr('data-role', 'button').attr('data-icon', 'arrow-r').attr('data-iconpos','notext');
            elm.trigger('create');
        }
    };

})(jQuery);
