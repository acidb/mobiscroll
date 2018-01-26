import { $, mobiscroll } from '../core/dom';

function createComponent(name, Component, preset) {
    mobiscroll[name] = function (selector, s) {
        var inst,
            instIds,
            ret = {},
            options = s || {};

        if (preset !== false) {
            options.preset = name;
        }

        $(selector).each(function () {
            inst = new Component(this, options);
            ret[this.id] = inst;
        });

        instIds = Object.keys(ret);

        return instIds.length == 1 ? ret[instIds[0]] : ret;
    };
}

export { createComponent, mobiscroll };

export default mobiscroll;
