import angular from 'angular';
import mobiscroll from './frameworks/ng';
import './classes/scroller';

angular
    .module('mobiscroll-scroller', [])
    .directive('mobiscrollScroller', ['$parse', function ($parse) {
        return mobiscroll.ng.getDDO($parse, 'mobiscrollScroller', {});
    }]);

export default mobiscroll;
