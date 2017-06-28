import ko from 'knockout';
import mobiscroll from '../core/dom';
import {
    $,
    extend
} from '../core/core';

export default mobiscroll;

mobiscroll.ko = {};

var instances = mobiscroll.instances;

// the generic event handler for change event
function genericEventHandler(element, valueAccessor) {
    var inst = instances[element.id];
    if (inst) {
        mobiscroll.ko.preventUpdate[element.id] = true;
        // set the value
        valueAccessor()(inst.getVal());
        delete mobiscroll.ko.preventUpdate[element.id];
    }
}

mobiscroll.ko = {
    formOptions: {},
    preventUpdate: {},
    // returns the initialization object from the Options binding merged with the events
    getInitObject: function (allBindingsAccessor, preset, inheritOptions, element) {
        var initOptions = allBindingsAccessor()['mobiscroll.options'] || {},
            pres = preset ? ((typeof preset === "string") ? {
                preset: preset
            } : preset) : {},
            formElement = inheritOptions ? $(element).closest('[mbsc-form-opt]') : null,
            inheritedOpt = inheritOptions ? mobiscroll.ko.formOptions[formElement.attr('id')] : {};

        initOptions = extend({}, inheritedOpt, initOptions, pres);

        return initOptions;
    },

    initializeGenericComponent: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext, preset, addInitOpt, eventName, eventHandler, inheritOptions) {
        // initialize mobiscroll on the element
        var initOptions = mobiscroll.ko.getInitObject(allBindingsAccessor, preset, inheritOptions, element);

        extend(initOptions, addInitOpt || {});

        var inst = new mobiscroll.classes[initOptions.component || 'Scroller'](element, initOptions),
            instSet = allBindingsAccessor()['mobiscroll.instance'];

        if (instSet !== undefined) {
            viewModel[instSet] = inst;
        }

        // register the event handler on the element
        if (!eventName) {
            eventName = 'change';
        }

        if (!eventHandler) {
            eventHandler = genericEventHandler;
        }

        ko.utils.registerEventHandler(element, eventName, function () {
            eventHandler(element, valueAccessor);
        });

        // when node removed from DOM dispose the scroller
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            inst.destroy();
        });
    },

    // updates the DOM element based on the observable value
    updateGenericComponent: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            inst = instances[element.id];

        if (inst && !mobiscroll.ko.preventUpdate[element.id]) {
            inst.setVal(value, true, false);
        }
    }
};

export {
    $,
    extend
};
