import { createComponent, enhance, registerComponent as register } from '@framework/renderer';
import jQuery from 'jquery';
import { doc } from '../core/util/dom';
import { isString, UNDEFINED } from '../core/util/misc';
import { isBrowser } from '../core/util/platform';

const extend = jQuery.extend;
const components = {};

export function registerComponent(Component?: any) {
  // Register for auto-init
  if (Component._selector) {
    register(Component);
  }
  // Register as a jquery plugin
  components[Component._fname] = function (options: any) {
    if (Component) {
      this.each(function () {
        createComponent(Component, this, options, Component._renderOpt);
      });
    }
    return this;
  };
}

jQuery.fn.mobiscroll = function (options: any, ...args: any[]) {
  extend(this, components);
  if (isString(options)) {
    let ret = this;
    this.each(function () {
      let returnValue: any;
      const inst = this.__mbscInst;
      if (inst && inst[options]) {
        returnValue = inst[options].apply(inst, args);
        if (returnValue !== UNDEFINED) {
          ret = returnValue;
          return false;
        }
      }
    });
    return ret;
  }
  return this;
};

if (isBrowser) {
  jQuery(() => {
    enhance(doc);
  });

  jQuery(doc).on('mbsc-enhance', (ev: any) => {
    enhance(ev.target);
  });
}
