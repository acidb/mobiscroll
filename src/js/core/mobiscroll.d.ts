export interface IMobiscroll {
    settings: any;
    $: any;
    i18n: any;
    fw: string;
    apiKey?: string;
    apiUrl?: string;
    uid?: string;
    util: IMobiscrollUtils;
    activeInstance?: any;
    platform: {
        name: string;
        majorVersion: number;
        minorVersion: number;
    };
    customTheme: (name: string, baseTheme: string) => void;
}

export interface IMobiscrollUtils { }

export const mobiscroll: IMobiscroll;
