import { forwardRef, Inject, Injectable, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { MbscOptions } from '../core/commons';
import { Observable } from '../core/util/observable';

export const MBSC_OPTIONS = new InjectionToken<any>('MbscOptions');

/**
 * A service for providing options for components, as well as means to be updated
 * when these options change.
 */
@Injectable()
export class MbscOptionsService<OptionType extends MbscOptions = MbscOptions> {
  /**
   * Observable that notifies subscribers on the setting changes
   */
  public change: Observable<OptionType> = new Observable<OptionType>();

  private _options: any = {};

  constructor(
    @Optional() @Inject(MBSC_OPTIONS) private _staticOptions: any,
    @Optional() @SkipSelf() @Inject(forwardRef(() => MbscOptionsService)) private _parentService: MbscOptionsService<any>,
  ) {}

  /**
   * Returns the options the service provides
   */
  public get options(): OptionType {
    return this._options;
  }

  /**
   * Provides the new options to the consumers of the service.
   * Notifies any subscribers for the change.
   * @param newOptions The new options object
   */
  public setOptions(newOptions: OptionType) {
    // Merge static, parent and own options here
    // 'as object' is needed for Angular 4, with Typescript 2.x
    this._options = this._parentService
      ? { ...this._staticOptions, ...this._parentService.options, ...(newOptions as object) }
      : { ...this._staticOptions, ...(newOptions as object) };
    this.change.next(this.options);
  }
}
