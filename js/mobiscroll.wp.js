(function ($) {

    var anim;

    $.mobiscroll.themes.wp = {
        defaults: {
            minWidth: 70,
            height: 76,
            accent: 'none',
            dateOrder: 'mmMMddDDyy',
            headerText: false,
            showLabel: false,
            btnWidth: false,
            onAnimStart: function (dw, i, time) {
                $('.dwwl' + i, dw).addClass('wpam');
                clearTimeout(anim[i]);
                anim[i] = setTimeout(function () {
                    $('.dwwl' + i, dw).removeClass('wpam');
                }, time * 1000 + 100);
            }
        },
        load: function (lang, s) {
            if (lang && lang.dateOrder && !s.dateOrder) {
                var ord = lang.dateOrder;
                ord = ord.match(/mm/i) ? ord.replace(/mmMM|mm|MM/,  'mmMM') : ord.replace(/mM|m|M/,  'mM');
                ord = ord.match(/dd/i) ? ord.replace(/ddDD|dd|DD/,  'ddDD') : ord.replace(/dD|d|D/,  'dD');
                s.dateOrder = ord;
            }
        },
        init: function (elm, inst) {
            var click,
                active;

            anim = {};

            $('.dw', elm).addClass('wp-' + inst.settings.accent);

            //$('.dwwl', elm).on('touchstart mousedown DOMMouseScroll mousewheel', function () {
            $('.dwwl', elm).on('touchstart mousedown DOMMouseScroll mousewheel', '.dw-sel', function () {
                click = true;
                active = $(this).closest('.dwwl').hasClass('wpa');
                $('.dwwl', elm).removeClass('wpa');
                $(this).closest('.dwwl').addClass('wpa');
            }).on('touchmove mousemove', function () {
                click = false;
            }).on('touchend mouseup', function () {
                if (click && active) {
                    $(this).closest('.dwwl').removeClass('wpa');
                }
            });
        }
    };

    $.mobiscroll.themes['wp light'] = $.mobiscroll.themes.wp;

})(jQuery);


