(function ($) {

    if ($.widget) {

        $.widget("mobile.jqmMobiscroll", $.mobile.widget, {
            options: {
                theme: 'jqm',
                preset: 'date',
                animate: 'pop'
            },
            _create: function () {
                var input = this.element,
                    o = $.extend(this.options, input.jqmData('options'));

                input.mobiscroll(o);
            }
        });

        $(document).on('pagecreate', function (c) {
            $(':jqmData(role="mobiscroll")', c.target).each(function () {
                $(this).jqmMobiscroll();
            });
        });

    }

})(jQuery);
