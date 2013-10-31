(function ($) {

    $.mobiscroll.themes.bootstrap = {
        disabledClass: 'disabled',
        activeClass: 'btn-primary',
        activeTabClass: 'active',
        onMarkupInserted: function (dw) {
            $('.dw', dw).removeClass('dwbg').addClass('popover');
            $('.dwwr', dw).addClass('popover-content');
            $('.dwv', dw).addClass('popover-title');
            $('.dw-arr', dw).addClass('arrow');
            $('.dwb, .dwwb', dw).addClass('btn btn-default');
            $('.dwb-s .dwb', dw).removeClass('btn-default').addClass('btn btn-primary');

            // Calendar prev/next buttons
            $('.dw-cal-next .dw-cal-btn-txt', dw).prepend('<i class="icon icon-chevron-right glyphicon glyphicon-chevron-right"></i>');
            $('.dw-cal-prev .dw-cal-btn-txt', dw).prepend('<i class="icon icon-chevron-left glyphicon glyphicon-chevron-left"></i>');

            // Calendar tabs
            $('.dw-cal-tabs ul', dw).addClass('nav nav-tabs');

            // Calendar week numbers
            $('.dw-week-nrs-c', dw).addClass('popover');

            // Calendar events
            $('.dw-cal-events', dw).addClass('popover');
            $('.dw-cal-events-arr', dw).addClass('arrow');

            // Rangepicker start/end buttons
            $('.dw-dr', dw).addClass('btn btn-sm btn-small btn-default');
        },
        onPosition: function (dw) {
            setTimeout(function () {
                $('.dw-bubble-top', dw).removeClass('bottom').addClass('top');
                $('.dw-bubble-bottom', dw).removeClass('top').addClass('bottom');
            }, 10);
        },
        onEventBubbleShow: function (evd, evc) {
            $('.dw-cal-event-list', evc).addClass('list-group');
            $('.dw-cal-event', evc).addClass('list-group-item');

            setTimeout(function () {
                if (evc.hasClass('dw-cal-events-b')) {
                    evc.removeClass('top').addClass('bottom');
                } else {
                    evc.removeClass('bottom').addClass('top');
                }
            }, 10);
        }
    };

})(jQuery);
