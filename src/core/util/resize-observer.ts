import { doc, listen, raf, rafc, unlisten, win } from './dom';
import { UNDEFINED } from './misc';

const markup =
  '<div class="mbsc-resize"><div class="mbsc-resize-i mbsc-resize-x"></div></div>' +
  '<div class="mbsc-resize"><div class="mbsc-resize-i mbsc-resize-y"></div></div>';

let observer: any;
let count = 0;

export function resizeObserver(el: HTMLElement, callback: () => void, zone?: any) {
  let expand: HTMLElement;
  let expandChild: HTMLElement;
  let helper: HTMLElement | undefined;
  let hiddenRafId: number;
  let rafId: number;
  let shrink: HTMLElement;
  let stopCheck: boolean;
  let lastCheck = 0;

  function reset() {
    expandChild.style.width = '100000px';
    expandChild.style.height = '100000px';

    expand.scrollLeft = 100000;
    expand.scrollTop = 100000;

    shrink.scrollLeft = 100000;
    shrink.scrollTop = 100000;
  }

  function checkHidden() {
    const now = +new Date();
    hiddenRafId = 0;
    if (!stopCheck) {
      if (now - lastCheck > 200 && !expand.scrollTop && !expand.scrollLeft) {
        lastCheck = now;
        reset();
      }
      if (!hiddenRafId) {
        hiddenRafId = raf(checkHidden);
      }
    }
  }

  function onScroll() {
    if (!rafId) {
      rafId = raf(onResize);
    }
  }

  function onResize() {
    rafId = 0;
    reset();
    callback();
  }

  if (win && (win as any).ResizeObserver) {
    if (!observer) {
      observer = new (win as any).ResizeObserver((entries: any) => {
        if (!rafId) {
          rafId = raf(() => {
            for (const entry of entries) {
              // Sometimes this fires after unobserve has been called,
              // so we need to check if the callback function is still there
              if (entry.target.__mbscResize) {
                entry.target.__mbscResize();
              }
            }
            rafId = 0;
          });
        }
      });
    }
    count++;
    (el as any).__mbscResize = () => {
      if (zone) {
        zone.run(callback);
      } else {
        callback();
      }
    };
    observer.observe(el);
  } else {
    helper = doc && doc.createElement('div');
  }

  if (helper) {
    helper.innerHTML = markup;
    helper.dir = 'ltr'; // Need this to work in rtl as well;
    shrink = helper.childNodes[1] as HTMLElement;
    expand = helper.childNodes[0] as HTMLElement;
    expandChild = expand.childNodes[0] as HTMLElement;

    el.appendChild(helper);

    listen(expand, 'scroll', onScroll);
    listen(shrink, 'scroll', onScroll);

    if (zone) {
      zone.runOutsideAngular(() => {
        raf(checkHidden);
      });
    } else {
      raf(checkHidden);
    }
  }

  return {
    detach() {
      if (observer) {
        count--;
        delete (el as any).__mbscResize;
        observer.unobserve(el);
        if (!count) {
          observer = UNDEFINED;
        }
      } else {
        if (helper) {
          unlisten(expand, 'scroll', onScroll);
          unlisten(shrink, 'scroll', onScroll);
          el.removeChild(helper);
          rafc(rafId);
          helper = UNDEFINED;
        }
        stopCheck = true;
      }
    },
  };
}
