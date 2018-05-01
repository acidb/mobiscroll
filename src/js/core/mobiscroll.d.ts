export interface IMobiscroll {
    settings?: any,
    $?: any,
    apiKey?: string,
    apiUrl?: string,
    uid?: string,
    util?: {
        datetime?: {
            parseDate: (format: string, value: string, settings?: any) => Date,
            formatDate: (format: string, value: Date, settings?: any) => string
        }
    },

    alert?: (config: any) => Promise<boolean>,
    confirm?: (config: any) => Promise<boolean>,
    prompt?: (config: any) => Promise<string>,
    toast?: (config: any) => Promise<boolean>,
    snackbar?: (config: any) => Promise<boolean>,

    customTheme: (name: string, baseTheme: string) => void
}

export const mobiscroll: IMobiscroll;
