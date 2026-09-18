import { Component, ComponentChild } from './lib/src/index';

export class PureComponent<PropsType, StateType> extends Component<PropsType, StateType> {
  public render(): ComponentChild {
    return;
  }

  /** @hidden */
  public shouldComponentUpdate(props: any, state: any) {
    return shallowDiffers(props, this.props) || shallowDiffers(state, this.state);
  }
}

function shallowDiffers(a: any, b: any) {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return true;
    }
  }
  for (const key in b) {
    if (!(key in a)) {
      return true;
    }
  }
  return false;
}
