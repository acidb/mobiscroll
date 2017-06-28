import ko from 'knockout';
import mobiscroll, {
    $
} from './frameworks/knockout';
import './page.knockout';
import './classes/forms';

ko.bindingHandlers['mobiscroll.form'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var id,
            $elm = $(element),
            initOptions = mobiscroll.ko.getInitObject(allBindingsAccessor),
            inst = new mobiscroll.classes.Form(element, initOptions),
            instSet = allBindingsAccessor()['mobiscroll.instance'];

        if (instSet !== undefined) {
            viewModel[instSet] = inst;
        }

        $elm.attr('mbsc-form-opt', '');

        id = element.id;

        mobiscroll.ko.formOptions[id] = {
            theme: initOptions.theme,
            lang: initOptions.lang
        };

        ko.utils.registerEventHandler(element, 'mbscFormRefresh', function () {
            inst.refresh();
        });
    }
};

// custom binding for the stepper component
ko.bindingHandlers['mobiscroll.stepper'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        mobiscroll.ko.initializeGenericComponent(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext, {
            component: 'Stepper'
        }, null);
    },
    update: mobiscroll.ko.updateGenericComponent
};

// custom binding for the switch component
ko.bindingHandlers['mobiscroll.switch'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        mobiscroll.ko.initializeGenericComponent(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext, {
            component: 'Switch'
        }, null, undefined, undefined, true);
    },
    update: mobiscroll.ko.updateGenericComponent
};

// custom binding for the progress component
ko.bindingHandlers['mobiscroll.progress'] = {
    // gets called when the binding is applied to a node
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        mobiscroll.ko.initializeGenericComponent(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext, {
            component: 'Progress'
        }, null, undefined, undefined, true);
    },
    // gets called when the binding is applied to a node and every time the observable changes
    update: mobiscroll.ko.updateGenericComponent
};

// custom binding for the slider component
ko.bindingHandlers['mobiscroll.slider'] = {
    // gets called when the binding is applied to a node
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        mobiscroll.ko.initializeGenericComponent(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext, {
            component: 'Slider'
        }, null, undefined, undefined, true);
    },
    // gets called when the binding is applied to a node and every time the observable changes
    update: mobiscroll.ko.updateGenericComponent
};

export default mobiscroll;
