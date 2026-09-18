import { UNDEFINED } from '../util/misc';
import { Observable } from '../util/observable';

const radios: { [key: string]: { change: Observable<any>; selectedIndex?: number; value?: any } } = {};

export function subscribeRadio(name: string, handler: (value: any) => void): number {
  if (!radios[name]) {
    radios[name] = {
      change: new Observable<any>(),
      selectedIndex: -1,
    };
  }
  return radios[name].change.subscribe(handler);
}

export function unsubscribeRadio(name: string, key: number) {
  const data = radios[name];
  if (data) {
    data.change.unsubscribe(key);
    if (!data.change.nr) {
      delete radios[name];
    }
  }
}

export function setRadio(name: string, value: any, selectedIndex?: number) {
  const data = radios[name];
  if (data) {
    if (selectedIndex !== UNDEFINED) {
      data.selectedIndex = selectedIndex;
    }
    if (value !== UNDEFINED) {
      data.value = value;
    }
    data.change.next(data.value);
  }
}

export function getSelectedIndex(name: string) {
  return radios[name] && radios[name].selectedIndex;
}

export function setSelectedIndex(name: string, selectedIndex: number) {
  if (radios[name]) {
    radios[name].selectedIndex = selectedIndex;
  }
}
