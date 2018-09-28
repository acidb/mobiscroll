import {
    PropTypes,
    CorePropTypes,
    MbscBase,
    deepCompare
} from '../frameworks/react';

var reactFunc = PropTypes.func;

export class MbscScrollViewBase extends MbscBase {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        const nextOptions = this.getSettingsFromProps(nextProps);
        const thisOptions = this.getSettingsFromProps(this.props);
        this.optimizeUpdate = {
            updateOptions: !deepCompare(thisOptions, nextOptions),
            updateChildren: !deepCompare(this.props.children, nextProps.children)
        };
        return true;
    }
}

MbscScrollViewBase.propTypes = {
    ...CorePropTypes,
    itemWidth: PropTypes.number,
    layout: PropTypes.oneOf(['liquid', 'fixed']),
    snap: PropTypes.bool,
    threshold: PropTypes.number,
    paging: PropTypes.bool,
    onItemTap: reactFunc,
    onMarkupReady: reactFunc,
    onAnimationStart: reactFunc,
    onAnimationEnd: reactFunc,
    onMove: reactFunc,
    onGestureStart: reactFunc,
    onGestureEnd: reactFunc,
};