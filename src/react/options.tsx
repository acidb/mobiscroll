/** @jsxRuntime classic */
/** @jsx createElement */
import { Component, createContext, createElement } from 'react';

export const Options = createContext({});

// TODO: types
export class OptionsProvider extends Component<any> {
  public render() {
    return <Options.Provider value={this.props.options}>{this.props.children}</Options.Provider>;
  }
}
