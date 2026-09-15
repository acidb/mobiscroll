import { Injectable } from '@angular/core';

@Injectable()
export class MbscRadioService {
  public color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  public disabled?: boolean;
  public name!: string;
  public position?: 'start' | 'end';
  public select?: 'single' | 'multiple';
  public value?: any;
  public onChange?: (ev: any, value: any) => void;
}
