var Observable = (function () {
    function Observable() {
        this.keyCount = 0;
        this.subscribers = new Map();
    }
    Observable.prototype.subscribe = function (handler) {
        var key = this.keyCount++;
        this.subscribers.set(key, handler);
        return key;
    };
    Observable.prototype.unsubscribe = function (handler) {
        if (typeof (handler) === 'number') {
            this.subscribers.delete(handler);
        }
        else {
            var foundKey_1 = null;
            this.subscribers.forEach(function (fn, key) { if (fn === handler) {
                foundKey_1 = key;
            } });
            this.subscribers.delete(foundKey_1);
        }
    };
    Observable.prototype.next = function (value) {
        this.subscribers.forEach(function (handler) { handler(value); });
    };
    return Observable;
}());
export { Observable };
