export const UNDEFINED = undefined;
export const ARRAY3 = getArray(3);
export const ARRAY4 = getArray(4);
export const ARRAY7 = getArray(7);
export const ARRAY24 = getArray(24);

/**
 * Constrains the value to be between min and max.
 * @hidden
 * @param val   Tha value to constrain.
 * @param min   Min value.
 * @param max   Max value.
 * @return      The constrained value.
 */
export function constrain(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(val, max));
}

/** @hidden */
export function extend<T1 = object, T2 = object>(obj1: T1, obj2: T2) {
  return { ...obj1, ...obj2 };
}

/** @hidden */
export function isArray<T = any>(obj: any): obj is T[] {
  return Array.isArray(obj);
}

/** @hidden */
export function isNumeric(a: any): boolean {
  return a - parseFloat(a) >= 0;
}

/** @hidden */
export function isNumber(a: any): a is number {
  return typeof a === 'number';
}

/** @hidden */
export function isString(s: any): s is string {
  return typeof s === 'string';
}

/** @hidden */
export function isEmpty(v: any): v is undefined | null | '' {
  return v === UNDEFINED || v === null || v === '';
}

/** @hidden */
export function isUndefined(v: any): v is undefined {
  return typeof v === 'undefined';
}

/** @hidden */
export function isObject(v: any): v is object {
  return typeof v === 'object';
}

/** @hidden */
export function emptyOrTrue(value: any): boolean {
  return value !== null && value !== UNDEFINED && `${value}` !== 'false';
}

/**
 * Returns an array with the specified length.
 * @hidden
 * @param nr Length of the array to create.
 * @return Array with the specified length.
 */
export function getArray(nr: number): number[] {
  return Array.apply(0, Array(Math.max(0, nr))) as number[];
}

/** @hidden */
export function addPixel(value: any): string {
  return value !== UNDEFINED ? value + (isNumeric(value) ? 'px' : '') : '';
}

/** @hidden */
export function noop() {
  return;
}

/** @hidden */
export function pad(num: number, size = 2): string {
  let str = num + '';
  while (str.length < size) {
    str = '0' + str;
  }
  return str;
}

/** @hidden */
export function round(nr: number): number {
  return Math.round(nr);
}

/** @hidden */
export function step(value: number, st: number): number {
  return floor(value / st) * st;
}

/** @hidden */
export function floor(nr: number): number {
  return Math.floor(nr);
}

/** @hidden */
export function hasChanged(props: any, prevProps: any, names: string[]): boolean {
  for (const name of names) {
    if (props[name] !== prevProps[name]) {
      return true;
    }
  }
  return false;
}

/** @hidden */
export function throttle(fn: any, threshhold = 100) {
  let last: number;
  let timer: any;

  return (...args: any[]) => {
    const now = +new Date();

    if (last && now < last + threshhold) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn(...args);
      }, threshhold);
    } else {
      last = now;
      fn(...args);
    }
  };
}

/** @hidden */
export function debounce(fn: any, threshhold = 100) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, threshhold);
  };
}

/** Checks the equality of two arrays in content
 * The two arrays are considered equal when each item in them are equal
 * Item equality is checked by ===
 */
export function arrayContentEquals(arr1: any[], arr2: any[]) {
  // A few optimizations

  if (arr1 === arr2) {
    return true;
  }

  if ((arr1 && !arr2) || (arr2 && !arr1)) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  // Deep check
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // If arrived here, the two arrays are considered equal
  return true;
}

/**
 * Like setTimeout, but only for Angular, otherwise calls the function instantly.
 * @param inst The component instance.
 * @param cb The callback function.
 */
export function ngSetTimeout(inst: any, cb: () => void) {
  if (inst._cdr) {
    // It's an Angular component
    setTimeout(cb);
  } else {
    cb();
  }
}

/**
 * Returns the value of the first element in the array that satisfies the testing function.
 * If no values satisfy the testing function, undefined is returned.
 * @hidden
 * @param arr The array to search.
 * @param fn Function to execute on each value in the array.
 */
export function find<T>(arr: T[], fn: (item: T, i: number) => boolean): T | undefined {
  return findItemOrIndex<T>(arr, fn);
}

/**
 * Returns the index of the first element in the array that satisfies the testing function.
 * If no values satisfy the testing function, -1 is returned.
 * @hidden
 * @param arr The array to search.
 * @param fn Function to execute on each value in the array.
 */
export function findIndex<T>(arr: T[], fn: (item: T, i: number) => boolean): number {
  return findItemOrIndex<T>(arr, fn, true);
}

function findItemOrIndex<T>(arr: T[], fn: (item: T, i: number) => boolean): T | undefined;
function findItemOrIndex<T>(arr: T[], fn: (item: T, i: number) => boolean, index: boolean): number;
function findItemOrIndex<T>(arr: T[], fn: (item: T, i: number) => boolean, index?: boolean): T | number | undefined {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const item = arr[i];
    if (fn(item, i)) {
      return index ? i : item;
    }
  }
  return index ? -1 : UNDEFINED;
}

/**
 * Just like the .map() function, only it checks for single values as well, not only arrays
 * @param v a single value or an array of values to call the function on
 * @param fn the transform function to call on each item
 * @returns a single value or an array values transformed by the function provided
 */
export function map<T, U>(v: T | T[], fn: (data: T, index: number, array: T[]) => U) {
  if (isArray(v)) {
    return v.map(fn);
  } else {
    return fn(v, 0, [v]);
  }
}

/**
 * Converts map to array.
 */
export function toArray(m: { [key: string]: any }) {
  const arr = [];
  if (m) {
    for (const key of Object.keys(m)) {
      arr.push(m[key]);
    }
  }
  return arr;
}
