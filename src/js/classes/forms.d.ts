import { Base } from '../core/core';
import { MbscFormOptions } from './input';
import '../util/notifications';

export { MbscFormOptions };

export class Form extends Base {
    settings: MbscFormOptions;
    constructor(element: any, settings: MbscFormOptions);
    refresh(shallow?: boolean): void;
}