import angular from 'angular';
import { $, mobiscroll } from './frameworks/ng';
import { Form } from './classes/forms';
import { Switch } from './classes/switch';
import './page.ng';

var guid = +new Date();

angular
    .module('mobiscroll-form', [])
    .directive('mobiscrollForm', ['$parse', function ($parse) {
        // If ionic detected, disable tap on form elments,
        // Otherwise checkbox, radio, switch, segmented and buttons will not work properly
        if (typeof ionic !== 'undefined' || $('ion-content,ion-nav-view').length) {
            Form.prototype._defaults.tap = false;
            Switch.prototype._defaults.tap = false;
        }

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

                        mobiscroll.ng.formOptions[id] = opt;
                    },
                    post: function (scope, element, attrs) {
                        var inst = new Form(element[0], mobiscroll.ng.getOpt(scope, attrs, 'mobiscrollForm', true));

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
    }])
    .directive('mobiscrollProgress', ['$parse', function ($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollProgress', {
            component: 'Progress'
        }, undefined, undefined, undefined, undefined, true);
    }])
    .directive('mobiscrollSlider', ['$parse', function ($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollSlider', {
            component: 'Slider'
        }, undefined, undefined, undefined, undefined, true);
    }])
    .directive('mobiscrollRating', ['$parse', function($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollRating', {
            component: 'Rating'
        }, undefined, undefined, undefined, undefined, true);
    }]);

export default mobiscroll;
