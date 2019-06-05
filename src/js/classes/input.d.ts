import { FormControl } from './form-control';
import { MbscFormOptions } from './forms';

export class Input extends FormControl {
    constructor(element: any, settings: MbscFormOptions);
    refresh(): void;
}