import jQuery from 'jquery';
import mobiscroll from '../core/mobiscroll';

var extend = jQuery.extend;

function init(that, options, args) {
    var ret = that;

    // Init
    if (typeof options === 'object') {
        return that.each(function () {
            new mobiscroll.classes[options.component || 'Scroller'](this, options);
        });
    }

    // Method call
    if (typeof options === 'string') {
        that.each(function () {
            var r,
                inst = mobiscroll.instances[this.id];

            if (inst && inst[options]) {
                r = inst[options].apply(this, Array.prototype.slice.call(args, 1));
                if (r !== undefined) {
                    ret = r;
                    return false;
                }
            }
        });
    }

    return ret;
}

mobiscroll.presetShort = function (name, className, preset) {
    mobiscroll.components[name] = function (s) {
        return init(this, extend(s, {
            component: className,
            preset: preset === false ? undefined : name
        }), arguments);
    };
};

mobiscroll.$ = jQuery;

jQuery.mobiscroll = mobiscroll;

jQuery.fn.mobiscroll = function (method) {
    extend(this, mobiscroll.components);
    return init(this, method, arguments);
};

export default mobiscroll;
