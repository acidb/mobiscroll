import { Stepper as StepperComp } from '../../core/components/stepper/stepper.common';
import { renderOptions } from '../../preact/components/stepper';

export class Stepper extends StepperComp {
  public static _fname = 'stepper';
  public static _selector = '[mbsc-stepper]';
  public static _renderOpt = renderOptions;
}

// Types
export * from '../../core/components/stepper/stepper.types.public';
