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

class MbscNote extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        color: PropTypes.string
    }

    static defaultProps = {
        color: 'primary'
    }

    render = () => {
        var className = 'mbsc-note mbsc-note-' + this.props.color;
        return <div className={className}>{this.props.children}</div>;
    }
}


mobiscroll.Page = MbscPage;
mobiscroll.Note = MbscNote;

export default mobiscroll;
