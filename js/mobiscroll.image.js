(function ($) {
    var ms = $.mobiscroll,
        presets = ms.presets.scroller;

    ms.presetShort('image');
    
    presets.image = function (inst) {
        var ret,
            s = inst.settings;

        if (s.enhance) {
            inst._processMarkup =  function (markup) {
                markup = markup.replace(/<img(.|\n)*?(?=<p)|<img(.|\n)*>/, function (match) {
                    return '<div class="mbsc-img-c">' + match + '</div>';
                });

                markup = markup.replace(/<p>/g, '<p class="mbsc-img-txt">');
                markup = markup.replace(/<img/g, ' <img class="mbsc-img" ');
                markup = '<div class="mbsc-img-w">' + markup + '</div>';

                return markup;
            };
        }
        
        ret = presets.list.call(this, inst);
         
        return ret;
    };
    
})(jQuery);