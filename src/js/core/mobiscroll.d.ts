declare namespace mobiscroll {
    export interface IInstance<T> {
        settings: any;

        getVal(temp?: boolean): T;
        setVal(value: T, fill?: boolean, change?: boolean, temp?: boolean): void;
        destroy(): void;
    }

    let settings: any;
    let $: any;
    let apiKey: string;
    let apiUrl: string;
    let uid: string;

    function alert(config: any): Promise<boolean>;
    function confirm(config: any): Promise<boolean>;
    function prompt(config: any): Promise<string>;
    function toast(config: any): Promise<boolean>;
    function snackbar(config: any): Promise<boolean>;

    function customTheme(name: string, baseTheme: string): void;
}
export default mobiscroll;
