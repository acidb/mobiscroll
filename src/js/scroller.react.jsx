import { mobiscroll, ScrollerPropTypes, MbscInputBase } from './frameworks/react';
import './classes/scroller';

class MbscScroller extends MbscInputBase {
    constructor(props) {
        super(props);
        this.mbscInit = {
            component: 'Scroller'
        };
    }
}

MbscScroller.propTypes = {
    ...MbscScroller.propTypes,
    ...ScrollerPropTypes
}

mobiscroll.Scroller = MbscScroller;

export default mobiscroll;
