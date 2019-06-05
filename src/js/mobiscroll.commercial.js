import * as tslib_1 from "tslib";
import { Component, mobiscroll, MbscBase, ElementRef, ViewChild, Input, MbscOptionsService, Optional, NgZone } from './frameworks/angular';
var MbscCommercialComponent = (function (_super) {
    tslib_1.__extends(MbscCommercialComponent, _super);
    function MbscCommercialComponent(hostElement, optionsService, zone) {
        var _this = _super.call(this, hostElement, zone) || this;
        _this.optionsService = optionsService;
        _this.mbscOptions = {};
        _this.options = {};
        return _this;
    }
    MbscCommercialComponent.prototype.ngAfterViewInit = function () {
        if (!mobiscroll.alerted) {
            mobiscroll.confirm({
                title: 'Mobiscroll Lite doesn\'t support this functionality.',
                message: 'You can try the full toolset with a free trial. If you\'re having trouble, <a href="mailto:support@mobiscroll.com" target="_top">let us know</a>.',
                okText: 'Start Trial',
                cancelText: 'Ok',
                callback: function (startTrial) {
                    if (startTrial) {
                        window.open("//mobiscroll.com/", '_blank');
                    }
                }
            });
            mobiscroll.alerted = true;
        }
    };
    MbscCommercialComponent.decorators = [
        { type: Component, args: [{
                    selector: "\n    mbsc-calendar, [mbsc-calendar],\n    mbsc-date, [mbsc-date],\n    mbsc-time, [mbsc-time],\n    mbsc-datetime, [mbsc-datetime],\n    mbsc-eventcalendar, [mbsc-eventcalendar],\n    mbsc-card, [mbsc-card], mbsc-card-header, mbsc-card-content, mbsc-card-footer, mbsc-card-title, mbsc-card-subtitle,\n    mbsc-color, [mbsc-color],\n    mbsc-image, [mbsc-image],\n    mbsc-listview, mbsc-listview-item, mbsc-listview-header, mbsc-listview-sublist,\n    mbsc-measurement, [mbsc-measurement], mbsc-temperature, [mbsc-temperature], mbsc-distance, [mbsc-distance], mbsc-speed, [mbsc-speed], mbsc-force, [mbsc-force], mbsc-mass, [mbsc-mass],\n    mbsc-nav-item, mbsc-bottom-nav, mbsc-hamburger-nav, mbsc-tab-nav,\n    mbsc-number, [mbsc-number],\n    mbsc-numpad, [mbsc-numpad], mbsc-numpad-decimal, [mbsc-numpad-decimal], mbsc-numpad-date, [mbsc-numpad-date], mbsc-numpad-time, [mbsc-numpad-time], mbsc-numpad-timespan, [mbsc-numpad-timespan],\n    mbsc-optionlist, mbsc-option-item,\n    mbsc-range, [mbsc-range],\n    mbsc-scroller, [mbsc-scroller],\n    mbsc-scrollview, [mbsc-scrollview], mbsc-scrollview-item, [mbsc-scrollview-item],\n    mbsc-select, [mbsc-select],\n    mbsc-timer, [mbsc-timer],\n    mbsc-timespan, [mbsc-timespan],\n    mbsc-treelist, [mbsc-treelist],\n    mbsc-widget\n    ",
                    template: '<ng-content></ng-content>',
                    exportAs: 'mobiscroll',
                    styles: [':host { display: block }']
                },] },
    ];
    MbscCommercialComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: MbscOptionsService, decorators: [{ type: Optional },] },
        { type: NgZone, },
    ]; };
    MbscCommercialComponent.propDecorators = {
        'mbscOptions': [{ type: Input, args: ['mbsc-options',] },],
        'options': [{ type: Input },],
        'data': [{ type: Input },],
        'mbscData': [{ type: Input, args: ['mbsc-data',] },],
        'initElem': [{ type: ViewChild, args: ['initElement',] },],
    };
    return MbscCommercialComponent;
}(MbscBase));
export { MbscCommercialComponent };
