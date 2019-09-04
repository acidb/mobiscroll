import { MbscFormOptions } from './input';

export class FormControl {
    settings: MbscFormOptions;
    
    constructor(element: any, settings: MbscFormOptions);

    destroy(): void;
    option(settings: MbscFormOptions): void;
    handleEvent(event: any): void;
}