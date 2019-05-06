import {
    Component,
    mobiscroll,
    MbscBase,
    ElementRef,
    ViewChild,
    Input,
    AfterViewInit,
    MbscOptionsService,
    Optional,
    NgZone
} from './frameworks/angular';

import { MbscCoreOptions } from './core/core';

@Component({
    selector: `
    mbsc-calendar, [mbsc-calendar],
    mbsc-date, [mbsc-date],
    mbsc-time, [mbsc-time],
    mbsc-datetime, [mbsc-datetime],
    mbsc-eventcalendar, [mbsc-eventcalendar],
    mbsc-card, [mbsc-card], mbsc-card-header, mbsc-card-content, mbsc-card-footer, mbsc-card-title, mbsc-card-subtitle,
    mbsc-color, [mbsc-color],
    mbsc-image, [mbsc-image],
    mbsc-listview, mbsc-listview-item, mbsc-listview-header, mbsc-listview-sublist,
    mbsc-measurement, [mbsc-measurement], mbsc-temperature, [mbsc-temperature], mbsc-distance, [mbsc-distance], mbsc-speed, [mbsc-speed], mbsc-force, [mbsc-force], mbsc-mass, [mbsc-mass],
    mbsc-nav-item, mbsc-bottom-nav, mbsc-hamburger-nav, mbsc-tab-nav,
    mbsc-number, [mbsc-number],
    mbsc-numpad, [mbsc-numpad], mbsc-numpad-decimal, [mbsc-numpad-decimal], mbsc-numpad-date, [mbsc-numpad-date], mbsc-numpad-time, [mbsc-numpad-time], mbsc-numpad-timespan, [mbsc-numpad-timespan],
    mbsc-optionlist, mbsc-option-item,
    mbsc-range, [mbsc-range],
    mbsc-scroller, [mbsc-scroller],
    mbsc-scrollview, [mbsc-scrollview], mbsc-scrollview-item, [mbsc-scrollview-item],
    mbsc-select, [mbsc-select],
    mbsc-timer, [mbsc-timer],
    mbsc-timespan, [mbsc-timespan],
    mbsc-treelist, [mbsc-treelist],
    mbsc-widget
    `,
    template: '<ng-content></ng-content>',
    exportAs: 'mobiscroll',
    styles: [':host { display: block }']
})
export class MbscCommercialComponent extends MbscBase implements AfterViewInit {

    @Input('mbsc-options')
    mbscOptions: MbscCoreOptions = {};

    @Input()
    options: MbscCoreOptions = {};

    @Input()
    data: any;

    @Input('mbsc-data')
    mbscData: any;

    @ViewChild('initElement')
    initElem: ElementRef;

    constructor(hostElement: ElementRef, @Optional() public optionsService: MbscOptionsService, zone: NgZone) {
        super(hostElement, zone);
    }

    ngAfterViewInit() {
        if (!(mobiscroll as any).alerted) {
            mobiscroll.confirm({
                title: 'Mobiscroll Lite doesn\'t support this functionality.',
                message: 'You can try the full toolset with a free trial. If you\'re having trouble, <a href="mailto:support@mobiscroll.com" target="_top">let us know</a>.',
                okText: 'Start Trial',
                cancelText: 'Ok',
                callback: (startTrial: boolean) => {
                    if (startTrial) {
                        window.open("//mobiscroll.com/", '_blank');
                    }
                }
            });
            (mobiscroll as any).alerted = true;
        }
    }

}