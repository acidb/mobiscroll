import { MbscBase, ElementRef, AfterViewInit, MbscOptionsService } from './frameworks/angular';
import { MbscCoreOptions } from './core/core';
export declare class MbscCommercialComponent extends MbscBase implements AfterViewInit {
    optionsService: MbscOptionsService;
    mbscOptions: MbscCoreOptions;
    options: MbscCoreOptions;
    data: any;
    mbscData: any;
    initElem: ElementRef;
    constructor(hostElement: ElementRef, optionsService: MbscOptionsService);
    ngAfterViewInit(): void;
}
