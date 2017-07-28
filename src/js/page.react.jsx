import React from 'react';
import ReactDOM from 'react-dom';
import { extend, mobiscroll, PropTypes, MbscOptimized, CorePropTypes } from './frameworks/react';
import './classes/page';

class MbscPage extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new mobiscroll.classes.Page(ReactDOM.findDOMNode(this), settings);
    }

    render = () => {
        return <div className={this.initialCssClass}>{this.props.children}</div>;
    }
}

MbscPage.propTypes = {
    ...MbscPage.propTypes,
    ...CorePropTypes,
    onInit: PropTypes.func
}

mobiscroll.Page = MbscPage

export default mobiscroll;
