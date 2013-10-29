(function ($) {

    $.mobiscroll.themes.bootstrap = {
        disabledClass: 'disabled',
        activeClass: 'btn-primary',
        activeTabClass: 'active',
        onMarkupInserted: function (dw) {
            $('.dw', dw).removeClass('dwbg').addClass('popover');
            $('.dwwr', dw).addClass('popover-content');
            $('.dwv', dw).addClass('popover-title');
            $('.dwb, .dwwb', dw).addClass('btn btn-default');
            $('.dwb-s .dwb', dw).removeClass('btn-default').addClass('btn btn-primary');

            // Calendar prev/next buttons
            $('.dw-cal-next .dw-cal-btn-txt', dw).prepend('<i class="icon icon-chevron-right glyphicon glyphicon-chevron-right"></i>');
            $('.dw-cal-prev .dw-cal-btn-txt', dw).prepend('<i class="icon icon-chevron-left glyphicon glyphicon-chevron-left"></i>');

            // Calendar tabs
            $('.dw-cal-tabs ul', dw).addClass('nav nav-tabs');

            // Calendar events
            $('.dw-cal-events', dw).addClass('popover');
            $('.dw-cal-events-arr', dw).addClass('arrow');

            // Rangepicker start/end buttons
            $('.dw-dr', dw).addClass('btn btn-sm btn-small btn-default');
        },
        onEventBubbleShow: function (evd, evc) {
            $('.dw-cal-event-list', evc).addClass('list-group');
            $('.dw-cal-event', evc).addClass('list-group-item');

            setTimeout(function () {
                $('.dw-cal-events').removeClass('bottom').addClass('top');
                $('.dw-cal-events-b').removeClass('top').addClass('bottom');
            }, 10);
        }
    };

})(jQuery);
