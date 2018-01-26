import jQuery from 'jquery';
import { mobiscroll } from '../core/mobiscroll';

const extend = jQuery.extend;
const components = {};

function init(that, options, args) {
    var ret = that;

    // Init
    if (typeof options === 'object') {
        return that.each(function () {
            new options.component(this, options);
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

function createComponent(name, Component, preset) {
    components[name] = function (s) {
        return init(this, extend(s, {
            component: Component,
            preset: preset === false ? undefined : name
        }), arguments);
    };
}

mobiscroll.$ = jQuery;

jQuery.mobiscroll = mobiscroll;

jQuery.fn.mobiscroll = function (method) {
    extend(this, components);
    return init(this, method, arguments);
};

export { createComponent, mobiscroll };

export default mobiscroll;
