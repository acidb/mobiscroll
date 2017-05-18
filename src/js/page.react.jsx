import { mobiscroll, createReactClass, PropTypes } from './frameworks/react';
import './classes/page';

mobiscroll.Page = createReactClass({
    mixins: [
        mobiscroll.react.mixins.InitialOptionsMixin,
        mobiscroll.react.mixins.UpdateOptimizeMixin,
        mobiscroll.react.mixins.UnmountMixin,
        mobiscroll.react.mixins.CorePropTypes
    ],
    propTypes: {
        onInit: PropTypes.func
    },
    componentDidMount: function () {
        // get settings from state
        var settings = mobiscroll.$.extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new mobiscroll.classes.Page(ReactDOM.findDOMNode(this), settings);
    },
    render: function () {
        return <div className={this.initialCssClass}>{this.props.children}</div>;
    }
});

export default mobiscroll;
