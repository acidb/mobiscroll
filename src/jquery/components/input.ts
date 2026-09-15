import { Dropdown as DropdownComp } from '../../core/components/input/dropdown.common';
import { Input as InputComp } from '../../core/components/input/input.common';
import { Textarea as TextareaComp } from '../../core/components/input/textarea.common';
import { inputRenderOptions, selectRenderOptions, textareaRenderOptions } from '../../preact/components/input';

class Input extends InputComp {
  public static _fname = 'input';
  public static _selector = '[mbsc-input]';
  public static _renderOpt = inputRenderOptions;
}

class Dropdown extends DropdownComp {
  public static _fname = 'dropdown';
  public static _selector = '[mbsc-dropdown]';
  public static _renderOpt = selectRenderOptions;
}

class Textarea extends TextareaComp {
  public static _fname = 'textarea';
  public static _selector = '[mbsc-textarea]';
  public static _renderOpt = textareaRenderOptions;
}

// Types
export * from '../../core/components/input/input.types.public';

export { Dropdown, Input, Textarea };
