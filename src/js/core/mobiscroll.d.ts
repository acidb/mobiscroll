export interface IMobiscroll {
    settings: any;
    $: any;
    i18n: any;
    apiKey?: string;
    apiUrl?: string;
    uid?: string;
    util: IMobiscrollUtils;
    activeInstance?: any;
    customTheme: (name: string, baseTheme: string) => void;
}

export interface IMobiscrollUtils {}

export const mobiscroll: IMobiscroll;
