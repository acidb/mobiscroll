import mobiscroll, {
    $
} from '../core/dom';

mobiscroll.presetShort = function (name, className, preset) {
    mobiscroll[name] = function (selector, s) {
        var inst,
            instIds,
            ret = {},
            options = s || {};

        $.extend(options, {
            preset: preset === false ? undefined : name
        });

        $(selector).each(function () {
            inst = new mobiscroll.classes[className || 'Scroller'](this, options);
            ret[this.id] = inst;
        });

        instIds = Object.keys(ret);

        return instIds.length == 1 ? ret[instIds[0]] : ret;
    };
};

export default mobiscroll;
