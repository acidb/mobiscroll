import ko from 'knockout';
import mobiscroll from './frameworks/knockout';
import './classes/scroller';

ko.bindingHandlers['mobiscroll.scroller'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        mobiscroll.ko.initializeGenericComponent(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    update: mobiscroll.ko.updateGenericComponent
};

export default mobiscroll;
