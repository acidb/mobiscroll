import angular from 'angular';
import mobiscroll from '../core/dom';
import { $, extend } from '../core/core';

export default mobiscroll;

mobiscroll.ng = {};

var instances = mobiscroll.instances;

mobiscroll.ng = {
    getDDO: function ($parse, attrName, opt, render, read, parse, format, inheritOptions) {
        read = read || mobiscroll.ng.read;
        render = render || mobiscroll.ng.render;
        parse = parse || mobiscroll.ng.parse;
        format = format || mobiscroll.ng.format;

        return {
            restrict: 'A',
            require: '?ngModel',
            // In Angular 1.2.x needs priority 1, otherwise ngModel.$render won't work
            // In Angular 1.0.x and 1.1.x ngModel.$render won't work if priority is specified
            priority: angular.version && angular.version.major == 1 && angular.version.minor == 2 ? 1 : undefined,
            link: function (scope, element, attrs, ngModel) {
                var $element = $(element[0]),
                    inst;

                mobiscroll.ng.addWatch($parse, scope, ngModel, $element, attrs, attrName, render, read, parse, format);

                // Initialize mobiscroll on the element
                inst = new mobiscroll.classes[opt.component || 'Scroller'](element[0], extend(mobiscroll.ng.getOpt(scope, attrs, attrName, ngModel, inheritOptions, $element), opt || {}));

                // Add instance to scope if there is an attribute set
                if (attrs.mobiscrollInstance) {
                    $parse(attrs.mobiscrollInstance).assign(scope, inst);
                }
            }
        };
    },
    getOpt: function (scope, attrs, attrName, ngModel, inheritOptions, $element) {
        var initOpt = scope.$eval(attrs.mobiscrollOptions || '{}'),
            $formElement = inheritOptions ? $element.closest('[mbsc-form-opt]') : null;

        if (inheritOptions) {
            initOpt = extend({}, mobiscroll.ng.formOptions[$formElement.attr('id')] || {}, initOpt);
        }

        if (ngModel) {
            // prepare the initialization object for mobiscroll
            extend(initOpt, scope.$eval(attrs[attrName] || '{}'));
        }

        return initOpt;
    },
    read: function ($parse, attrName, $element, scope, attrs, ngModel, format) {
        var v,
            inst = instances[$element.attr('id')];

        if (inst) {
            v = format($element, inst.getVal());
            if (ngModel) {
                // Will trigger the parser ro run
                ngModel.$setViewValue(v);
            } else if (attrs[attrName]) {
                $parse(attrs[attrName]).assign(scope, v);
            }
        }
    },
    render: function ($element, v) {
        var inst = instances[$element.attr('id')];

        // Check if instance exists and value changed
        // In some cases, like select with ng-repeat
        // the mobiscroll init is postponed, so the instance
        // might not exist when the first render is called
        if (inst && !angular.equals(inst.getVal(), v)) {
            inst.setVal(v, true, false);
        }
    },
    parse: function ($element) {
        var v,
            inst = instances[$element.attr('id')];

        if (inst) {
            v = inst.getVal();
        }

        return $.isArray(v) && !v.length ? null : v;
    },
    format: function ($element, v) {
        // Return null, if value is an empty array,
        // if the value is requires, the validator accepts
        // the empty array as valid
        return $.isArray(v) && !v.length ? null : v;
    },
    addWatch: function ($parse, scope, ngModel, $element, attrs, attrName, render, read, parse, format) {
        render = render || mobiscroll.ng.render;
        read = read || mobiscroll.ng.read;
        parse = parse || mobiscroll.ng.parse;
        format = format || mobiscroll.ng.format;

        if (ngModel) {
            // Pass an empty function to the render, as
            // the watch will take care of the rendering.
            // The empty function is needed to override the render
            // for input and select directives
            ngModel.$render = function () {};

            ngModel.$parsers.unshift(function (viewValue) {
                return parse($element, viewValue);
            });

            ngModel.$formatters.push(function (v) {
                return format($element, v);
            });
        }

        // We have to add an extra watch since ngModel doesn't work well with arrays - it
        // doesn't trigger rendering if only an item in the array changes.
        // If ngModel is not specified, we need tha watch anyway.
        scope.$watch(function () {
            return ngModel ? ngModel.$modelValue : $parse(attrs[attrName])(scope);
        }, function (v) {
            render($element, v);
        }, true);

        // Destroy instance on scope destroy
        scope.$on('$destroy', function () {
            var inst = instances[$element[0].id];
            if (inst) {
                inst.destroy();
            }
        });

        // Listen to the change event
        // ngModel also listenes to it, but updates the viewValue
        // with the input value which is not what we want
        $element.on('change', function () {
            // We have to check here if we're inside a digest cycle or not
            if (!scope.$$phase) {
                scope.$apply(function () {
                    read($parse, attrName, $element, scope, attrs, ngModel, format);
                });
            } else {
                read($parse, attrName, $element, scope, attrs, ngModel, format);
            }
        });
    },
    formOptions: {}
};

export { $, extend };
