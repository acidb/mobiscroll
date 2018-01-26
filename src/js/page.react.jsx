import React from 'react';
import ReactDOM from 'react-dom';
import { extend, mobiscroll, PropTypes, MbscOptimized, CorePropTypes } from './frameworks/react';
import { Page } from './classes/page';

class MbscPage extends MbscOptimized {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        // get settings from state
        var settings = extend({}, this.state.options);
        // initialize the mobiscroll
        this.instance = new Page(ReactDOM.findDOMNode(this), settings);
    }

    render = () => {
        return <div className={this.initialCssClass}>{this.props.children}</div>;
    }
}

MbscPage.propTypes = {
    ...MbscPage.propTypes,
    ...CorePropTypes,
    onInit: PropTypes.func
};

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

class MbscAvatar extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return <img className="mbsc-avatar" src={this.props.src} alt={this.props.alt} />;
    }
}


mobiscroll.Page = MbscPage;
mobiscroll.Note = MbscNote;
mobiscroll.Avatar = MbscAvatar;

export default mobiscroll;
