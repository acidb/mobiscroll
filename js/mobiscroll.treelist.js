(function ($) {
    var ms = $.mobiscroll,
        presets = ms.presets.scroller;

    presets.treelist = presets.list;

    ms.presetShort('list');
    ms.presetShort('treelist');

})(jQuery);