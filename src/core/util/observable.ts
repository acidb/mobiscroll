type Handler<T> = (value?: T) => void;

export class Observable<T> {
  public nr = 0;

  private _keys = 1;
  private _subscribers: { [key: string]: Handler<T> } = {};

  /**
   * Subscribes a function that will be called when the observable changes. It will receive the new value as parameter.
   * NOTE: Don't forget to unsubscribe to prevent memory leaks!
   * @param handler A function that will be called when a new value is provided by the observable
   */
  public subscribe(handler: Handler<T>): number {
    const key = this._keys++;
    this._subscribers[key] = handler;
    this.nr++;
    return key;
  }

  /**
   * Unsubscribes a handler from the observable
   * @param handler The handler of the function returned by the subscribe method or the function itself
   */
  public unsubscribe(key: number) {
    this.nr--;
    delete this._subscribers[key];
  }

  /**
   * Notifies the subscribers of the observable of the next value.
   * @param value The next value of the observable
   */
  public next(value?: T): void {
    const subscribers = this._subscribers;
    for (const key of Object.keys(subscribers)) {
      if (subscribers[key]) {
        subscribers[key](value);
      }
    }
  }
}
