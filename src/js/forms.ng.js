import angular from 'angular';
import { $, mobiscroll, extend } from './frameworks/ng';
import { Slider } from './classes/slider';
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
        var ddo = mobiscroll.ng.getDDO($parse, 'mobiscrollSlider', {
            component: 'Slider'
        }, undefined, undefined, undefined, undefined, true);
        ddo.link = function (scope, element, attrs, ngModel) {
            var $element = $(element[0]),
                inst,
                read = mobiscroll.ng.read,
                format = mobiscroll.ng.format,
                attrName = 'mobiscrollSlider';

            mobiscroll.ng.addWatch($parse, scope, ngModel, $element, attrs, attrName, mobiscroll.ng.render, read, mobiscroll.ng.parse, format);

            var inputs = $element.parent().find('input');
            inputs.each(function (index) {
                if (index) {
                    $(this).on('change', function () {
                        // We have to check here if we're inside a digest cycle or not
                        if (!scope.$$phase) {
                            scope.$apply(function () {
                                read($parse, attrName, $element, scope, attrs, ngModel, format);
                            });
                        } else {
                            read($parse, attrName, $element, scope, attrs, ngModel, format);
                        }
                    });
                }
            });


            // Initialize mobiscroll on the element
            inst = new Slider(element[0], extend(mobiscroll.ng.getOpt(scope, attrs, 'mobiscrollSlider', ngModel, true, $element)));



            // Add instance to scope if there is an attribute set
            if (attrs.mobiscrollInstance) {
                $parse(attrs.mobiscrollInstance).assign(scope, inst);
            }
        };
        return ddo;
    }])
    .directive('mobiscrollRating', ['$parse', function ($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollRating', {
            component: 'Rating'
        }, undefined, undefined, undefined, undefined, true);
    }]);

export default mobiscroll;
