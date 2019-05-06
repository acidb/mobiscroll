import { IMobiscroll } from '../core/mobiscroll';
declare module '../core/mobiscroll' {
    export interface IMobiscroll {
        alert: (config: any) => Promise<boolean>;
        confirm: (config: any) => Promise<boolean>;
        prompt: (config: any) => Promise<string>;
        toast: (config: any) => Promise<boolean>;
        snackbar: (config: any) => Promise<boolean>;
        notification: {
            dismiss: () => void;
        };
    }
}
