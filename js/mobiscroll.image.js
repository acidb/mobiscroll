(function ($) {
    var ms = $.mobiscroll,
        presets = ms.presets.scroller;

    ms.presetShort('image');
    
    presets.image = function (inst) {

        if (inst.settings.enhance) {
            inst._processMarkup =  function (li) {
                var hasIcon = li.attr('data-icon');
               
                li.children().each(function (i, v) {
                    v = $(v);
                    if (v.is('img')) {
                        $('<div class="mbsc-img-c"></div>').insertAfter(v).append(v.addClass('mbsc-img'));
                    } else if (v.is('p')) {
                        v.addClass('mbsc-img-txt');
                    }
                });
                
                if (hasIcon) {
                    li.prepend('<div class="mbsc-ic mbsc-ic-' + hasIcon + '"></div');
                }
                
                li.html('<div class="mbsc-img-w">' + li.html() + '</div>');

                return li.html();
            };
        }
        
        return presets.list.call(this, inst);
    };
    
})(jQuery);
