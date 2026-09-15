import { Dropdown as DropdownComp } from '../../core/components/input/dropdown.common';
import { Input as InputComp } from '../../core/components/input/input.common';
import { MbscInputOptions } from '../../core/components/input/input.types.public';
import { Textarea as TextareaComp } from '../../core/components/input/textarea.common';
import { inputRenderOptions, selectRenderOptions, textareaRenderOptions } from '../../preact/components/input';
import { createComponentFactory } from '../base';

class Input extends InputComp {
  public static _selector = '[mbsc-input]';
  public static _renderOpt = inputRenderOptions;
}
class Dropdown extends DropdownComp {
  public static _selector = '[mbsc-dropdown]';
  public static _renderOpt = selectRenderOptions;
}
class Textarea extends TextareaComp {
  public static _selector = '[mbsc-textarea]';
  public static _renderOpt = textareaRenderOptions;
}

export const input = /*#__PURE__*/ createComponentFactory<MbscInputOptions, Input>(Input, inputRenderOptions);
export const dropdown = /*#__PURE__*/ createComponentFactory<MbscInputOptions, Input>(Dropdown, selectRenderOptions);
export const textarea = /*#__PURE__*/ createComponentFactory<MbscInputOptions, Input>(Textarea, inputRenderOptions);

// Types
export * from '../../core/components/input/input.types.public';

export { Input, Dropdown, Textarea };
