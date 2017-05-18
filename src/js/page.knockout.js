import ko from 'knockout';
import mobiscroll from './frameworks/knockout';
import './classes/page';

ko.bindingHandlers['mobiscroll.page'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var initOptions = mobiscroll.ko.getInitObject(allBindingsAccessor),
            inst = new mobiscroll.classes.Page(element, initOptions),
            instSet = allBindingsAccessor()['mobiscroll.instance'];

        if (instSet !== undefined) {
            viewModel[instSet] = inst;
        }
    }
};

export default mobiscroll;
