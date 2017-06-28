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

@Component({
    selector: 'mbsc-page',
    template: '<div #initElement><ng-content></ng-content></div>'
})
export class MbscPage extends MbscBase {
    @Input()
    options: any;

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