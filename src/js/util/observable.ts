export type Handler<T> = (value: T) => void;

export class Observable<T> {
    private keyCount = 0;
    // handler function map
    private subscribers: Map<number, Handler<T>> = new Map<number, Handler<T>>();  //  { [index: number]: Handler<T> } = {};

    /**
     * Subscribes a function that will be called when the observable changes. It will receive the new value as parameter.
     * NOTE: Don't forget to unsubscribe to prevent memory leaks!
     * @param handler A function that will be called when a new value is provided by the observable
     */
    public subscribe(handler: Handler<T>): number {
        const key = this.keyCount++;
        this.subscribers.set(key, handler);
        return key;
    }

    /**
     * Unsubscribes a handler from the observable
     * @param handler The handler of the function returned by the subscribe method or the function itself
     */
    public unsubscribe(handler: number | Handler<T>) {
        if (typeof(handler) === 'number') {
            this.subscribers.delete(handler);
        } else {
            let foundKey: number = null;
            this.subscribers.forEach((fn, key) => { if (fn === handler) { foundKey = key; } });
            this.subscribers.delete(foundKey);
        }
    }

    /**
     * Notifies the subscribers of the observable of the next value.
     * @param value The next value of the observable
     */
    public next(value: T): void {
        this.subscribers.forEach((handler) => { handler(value); });
    }
}
