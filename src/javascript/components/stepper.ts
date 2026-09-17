import { Stepper as StepperComp } from '../../core/components/stepper/stepper.common';
import { MbscStepperOptions } from '../../core/components/stepper/stepper.types.public';
import { renderOptions } from '../../preact/components/stepper';
import { createComponentFactory } from '../base';

export class Stepper extends StepperComp {
  public static _selector = '[mbsc-stepper]';
  public static _renderOpt = renderOptions;
}

export const stepper = /*#__PURE__*/ createComponentFactory<MbscStepperOptions, Stepper>(Stepper, renderOptions);

// Types
export * from '../../core/components/stepper/stepper.types.public';
