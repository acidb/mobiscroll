import {
    extend,
    Component,
    mobiscroll,
    MbscBase,
    ElementRef,
    ViewChild,
    Input
} from './frameworks/angular';

import Page from './classes/page';

import { MbscCoreOptions } from './core/core';

export interface MbscPageOptions extends MbscCoreOptions {
    // Settings
    context?: string | HTMLElement;
}

@Component({
    selector: 'mbsc-page',
    template: '<div #initElement><ng-content></ng-content></div>'
})
export class MbscPage extends MbscBase {
    @Input()
    options: MbscPageOptions;

    @ViewChild('initElement')
    initElem: ElementRef;

    constructor(hostElement: ElementRef) {
        super(hostElement);
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let options = extend({}, this.options);
        this._instance = new Page(this.initElem.nativeElement, options);
    }
}

@Component({
    selector: 'mbsc-note',
    template: '<ng-content></ng-content>',
    host: {
        '[class]': 'classNames'
    },
    styles: [':host { display: block; }']
})
export class MbscNote {
    get classNames(): string {
        return 'mbsc-note mbsc-note-' + this.color;
    }

    @Input()
    color: string = 'primary';

    constructor(public initialElem: ElementRef) {
    }
}