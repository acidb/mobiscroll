export declare type Handler<T> = (value: T) => void;
export declare class Observable<T> {
    private keyCount;
    private subscribers;
    subscribe(handler: Handler<T>): number;
    unsubscribe(handler: number | Handler<T>): void;
    next(value: T): void;
}
