import { updateValue } from './base';

type Constructor = new (...args: any[]) => any;

export function FormControl<T extends Constructor>(constructor: T) {
  const prototype = constructor.prototype;

  prototype.registerOnChange = function (fn: any) {
    this._onFormChange = fn;
  };

  prototype.registerOnTouched = function (fn: any) {
    this._onFormTouch = fn;
  };

  prototype.setDisabledState = function (disabled: boolean) {
    this.setState({ disabled });
  };

  prototype.writeValue = function (val: any) {
    updateValue(this, val);
  };
}
