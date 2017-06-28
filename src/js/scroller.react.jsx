import { mobiscroll } from './frameworks/react';
import './classes/scroller';

mobiscroll.Scroller = mobiscroll.react.createComponent({
    component: 'Scroller'
}, [
    mobiscroll.react.mixins.ScrollerPropTypes
]);

export default mobiscroll;
