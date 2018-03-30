import {
    MbscBase,
    extend,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    NgZone,
    Injectable,
    Subject,
    Observable,
    AfterViewInit,
    OnDestroy
} from '../frameworks/angular';

import { MbscScrollViewOptions } from './scrollview';


@Injectable()
export class MbscNotifyItemService {
    private _instanceSubject: Subject<any> = new Subject();
    private _addRemoveSubject: Subject<any> = new Subject();

    notifyInstanceReady(instance: any) {
        this._instanceSubject.next(instance);
    }

    notifyAddRemove(item: any) {
        this._addRemoveSubject.next(item);
    }

    onInstanceReady(): Observable<any> {
        return this._instanceSubject.asObservable();
    }

    onAddRemove(): Observable<any> {
        return this._addRemoveSubject.asObservable();
    }
}

export class MbscScrollItemBase implements AfterViewInit, OnDestroy {
    @Input()
    id: string;

    /**
     * Holds the component instance. It's populated after initialization
     */
    _instance: any = undefined;

    /**
     * Returns the native element of the component
     */
    get nativeElement(): any {
        return this._elem.nativeElement;
    }

    constructor(public notifyItemService: MbscNotifyItemService, public _elem: ElementRef) {
        this.notifyItemService.onInstanceReady().subscribe((instance: any) => {
            this._instance = instance;
        });
    }

    ngAfterViewInit() {
        this.notifyItemService.notifyAddRemove(this);
    }

    ngOnDestroy() {
        this.notifyItemService.notifyAddRemove(this);
    }
}

export class MbscScrollViewBase extends MbscBase {

    // Settings

    @Input()
    context: string | HTMLElement;
    @Input()
    itemWidth: number;
    @Input()
    layout: 'liquid' | 'fixed';
    @Input()
    snap: boolean;
    @Input()
    threshold: number;
    @Input()
    paging: boolean;

    // Events

    @Output()
    onItemTap: EventEmitter<{ target: HTMLElement, inst: any }> = new EventEmitter();
    @Output()
    onMarkupReady: EventEmitter<{ target: HTMLElement, inst: any }> = new EventEmitter();
    @Output()
    onAnimationStart: EventEmitter<{ inst: any }> = new EventEmitter();
    @Output()
    onAnimationEnd: EventEmitter<{ inst: any }> = new EventEmitter();
    @Output()
    onMove: EventEmitter<{ inst: any }> = new EventEmitter();
    @Output()
    onGestureStart: EventEmitter<{ inst: any }> = new EventEmitter();
    @Output()
    onGestureEnd: EventEmitter<{ inst: any }> = new EventEmitter();

    inlineOptions(): MbscScrollViewOptions {
        return extend(super.inlineOptions(), {
            context: this.context,
            itemWidth: this.itemWidth,
            layout: this.layout,
            snap: this.snap,
            threshold: this.threshold,
            paging: this.paging
        });
    }

    inlineEvents(): MbscScrollViewOptions {
        return extend(super.inlineEvents(), {
            onItemTap: (event: { target: HTMLElement, inst: any }, inst: any) => {
                event.inst = inst;
                this.onItemTap.emit(event);
            },
            onMarkupReady: (event: { target: HTMLElement, inst: any }, inst: any) => {
                event.inst = inst;
                this.onMarkupReady.emit(event);
            },
            onAnimationStart: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onAnimationStart.emit(event);
            },
            onAnimationEnd: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onAnimationEnd.emit(event);
            },
            onMove: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onMove.emit(event);
            },
            onGestureStart: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onGestureStart.emit(event);
            },
            onGestureEnd: (event: { inst: any }, inst: any) => {
                event.inst = inst;
                this.onGestureEnd.emit(event);
            }
        });
    }

    constructor(initialElem: ElementRef, public zone: NgZone, public notifyItemService: MbscNotifyItemService) {
        super(initialElem);
    }
}