import React from 'react';
import ReactDOM from 'react-dom';
import { extend, mobiscroll, PropTypes, MbscBase, CorePropTypes, deepCompare } from './frameworks/react';
import { Page } from './classes/page';


class MbscPage extends MbscBase {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // get settings from state
        var settings = this.getSettingsFromProps(this.props);
        // initialize the mobiscroll
        this.instance = new Page(ReactDOM.findDOMNode(this), settings);
    }

    shouldComponentUpdate(nextProps) {
        const thisOptions = this.getSettingsFromProps(this.props);
        const nextOptions = this.getSettingsFromProps(nextProps);
        // check if the options or the value changed
        var updateOptions = !deepCompare(thisOptions, nextOptions);

        // save what should be updated inside mobiscroll
        this.optimizeUpdate = {
            updateOptions: updateOptions
        };
        // component should update always, since it's a wrapper component, and it should not block any context
        return true;
    }

    render() {
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

    render() {
        var className = 'mbsc-note mbsc-note-' + this.props.color;
        return <div className={className}>{this.props.children}</div>;
    }
}

class MbscAvatar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <img className="mbsc-avatar" src={this.props.src} alt={this.props.alt} />;
    }
}


mobiscroll.Page = MbscPage;
mobiscroll.Note = MbscNote;
mobiscroll.Avatar = MbscAvatar;

export default mobiscroll;
