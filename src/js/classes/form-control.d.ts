import { MbscFormOptions } from './forms';

export class FormControl {
    settings: MbscFormOptions;
    
    constructor(element: any, settings: MbscFormOptions);

    destroy(): void;
    option(settings: MbscFormOptions): void;
    handleEvent(event: any): void;
}