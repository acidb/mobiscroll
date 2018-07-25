import { MbscFormOptions } from './forms';
import { Input } from './input';

export class TextArea extends Input {
    constructor(element: any, settings: MbscFormOptions);
    resize(): void;
}