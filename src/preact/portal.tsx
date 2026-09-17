import { createPortal } from './lib/portal';
import { Component } from './lib/src/index';

interface IPortalProps {
  context: any;
  children: any;
}

/** @hidden */
export class Portal extends Component<IPortalProps> {
  public render() {
    const context = this.props.context;
    return context ? createPortal(this.props.children, context) : null;
  }
}
