import { raf } from './platform';

const innerStyle = 'position:absolute;left:0;top:0;';
const style = innerStyle + 'right:0;bottom:0;overflow:hidden;z-index:-1;';
const markup =
    '<div style="' + style + '"><div style="' + innerStyle + '"></div></div>' +
    '<div style="' + style + '"><div style="' + innerStyle + 'width:200%;height:200%;"></div></div>';

export function resizeObserver(el, callback, zone) {

    function reset() {
        expandChild.style.width = '100000px';
        expandChild.style.height = '100000px';

        expand.scrollLeft = 100000;
        expand.scrollTop = 100000;

        shrink.scrollLeft = 100000;
        shrink.scrollTop = 100000;
    }

    function checkHidden() {
        var now = new Date();
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

    let expand;
    let expandChild;
    let hiddenRafId;
    let rafId;
    let shrink;
    let stopCheck;
    let lastCheck = 0;
    //let isHidden = true;

    const helper = document.createElement('div');

    helper.innerHTML = markup;
    helper.dir = 'ltr'; // Need this to work in rtl as well;
    shrink = helper.childNodes[1];
    expand = helper.childNodes[0];
    expandChild = expand.childNodes[0];

    el.appendChild(helper);

    expand.addEventListener('scroll', onScroll);
    shrink.addEventListener('scroll', onScroll);

    if (zone) {
        zone.runOutsideAngular(function () {
            raf(checkHidden);
        });
    } else {
        raf(checkHidden);
    }

    return {
        detach: function () {
            el.removeChild(helper);
            stopCheck = true;
        }
    };
}
