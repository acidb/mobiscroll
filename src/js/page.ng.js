import angular from 'angular';
import mobiscroll from './frameworks/ng';
import { Page } from './classes/page';

angular
    .module('mobiscroll-page', [])
    .directive('mobiscrollPage', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var inst = new Page(element[0], mobiscroll.ng.getOpt(scope, attrs, 'mobiscrollPage', true));

                // Add instance to scope if there is an attribute set
                if (attrs.mobiscrollInstance) {
                    $parse(attrs.mobiscrollInstance).assign(scope, inst);
                }

                scope.$on('$destroy', function () {
                    inst.destroy();
                });
            }
        };
    }])
    .directive('mobiscrollAvatar', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element[0].classList.add('mbsc-avatar');
            }
        };
    });

export default mobiscroll;
