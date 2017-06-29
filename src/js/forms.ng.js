import angular from 'angular';
import mobiscroll from './frameworks/ng';
import './page.ng';
import './classes/forms';

var guid = +new Date();

angular
    .module('mobiscroll-form', [])
    .directive('mobiscrollForm', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            compile: function () {
                return {
                    pre: function (scope, elm, attrs) {
                        var opt = mobiscroll.ng.getOpt(scope, attrs, 'mobiscrollForm', true),
                            id = attrs.id;

                        if (!id) {
                            id = 'mbsc-form-' + guid++;
                            elm.attr('id', id);
                        }

                        elm.attr('mbsc-form-opt', '');

                        mobiscroll.ng.formOptions[id] = {
                            theme: opt.theme,
                            lang: opt.lang
                        };
                    },
                    post: function (scope, element, attrs) {
                        var inst = new mobiscroll.classes.Form(element[0], mobiscroll.ng.getOpt(scope, attrs, 'mobiscrollForm', true));

                        // Add instance to scope if there is an attribute set
                        if (attrs.mobiscrollInstance) {
                            $parse(attrs.mobiscrollInstance).assign(scope, inst);
                        }

                        scope.$on('mbscFormRefresh', function () {
                            inst.refresh();
                        });

                        scope.$on('$destroy', function () {
                            inst.destroy();
                            inst = null;
                        });
                    }
                };
            }
        };
    }])
    .directive('mobiscrollSwitch', ['$parse', function ($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollSwitch', {
            component: 'Switch'
        }, undefined, undefined, undefined, undefined, true);
    }])
    .directive('mobiscrollStepper', ['$parse', function ($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollStepper', {
            component: 'Stepper'
        });
    }]);

angular
    .module('mobiscroll-progress', [])
    .directive('mobiscrollProgress', ['$parse', function ($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollProgress', {
            component: 'Progress'
        }, undefined, undefined, undefined, undefined, true);
    }]);

angular
    .module('mobiscroll-slider', [])
    .directive('mobiscrollSlider', ['$parse', function ($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollSlider', {
            component: 'Slider'
        }, undefined, undefined, undefined, undefined, true);
    }]);

export default mobiscroll;
