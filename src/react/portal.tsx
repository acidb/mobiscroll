import { Component } from 'react';
import { createPortal } from 'react-dom';

interface IPortalProps {
  children: any;
  context: any;
}

/** @hidden */
export class Portal extends Component<IPortalProps> {
  public render() {
    const context = this.props.context;
    return context ? createPortal(this.props.children, context) : null;
  }
}
