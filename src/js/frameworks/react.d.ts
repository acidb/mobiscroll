import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IMobiscroll as _IMobiscroll } from '../core/mobiscroll';
import { MbscFormOptions } from '../classes/forms';
import { MbscPageOptions } from '../classes/page';
import { MbscPopupOptions } from '../classes/popup';
import { MbscScrollerOptions } from '../classes/scroller';

export { MbscFormOptions };
export { MbscPageOptions };
export { MbscPopupOptions };
export { MbscScrollerOptions };

/**
 * Generic base types for use later
 * --------------------------------
 */

/**
 * Base type for the Components
 * Enables to define an interface property as "new"-able.
 */
interface MbscComponent<BaseOptionType, AdditionalPropTypes = {}> extends Component<BaseOptionType & AdditionalPropTypes> {
    new(): Component<BaseOptionType & AdditionalPropTypes>;
}

interface InputPassThroughProps {
    className?: string;
    placeholder?: string;
    type?: string;
}

interface InputBaseComponent<BaseOptionType, AdditionalPropTypes = {}> extends MbscComponent<BaseOptionType & InputPassThroughProps, AdditionalPropTypes> { }

/**
 * Base prop-type for a generic value
 */
type ValuePropType<V> = { value?: V };

/**
 * Prop type for components that accept date as value prop
 */
type MbscDateType = string | Date | object | null;
type DateValueProp = ValuePropType<MbscDateType>;

/**
 * Prop type for components that accept number as value prop
 */
type NumberValueType = ValuePropType<number>;

/**
 * Prop type for components that accept anything as value prop
 */
type AnyValueProp = ValuePropType<any>;

/**
 * Prop type for components that accept string as value prop
 */
type StringValueProp = ValuePropType<string>;

/**
 * Prop type for components that accept className as prop type
 */
interface ClassNameProp {
    className?: string;
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    valid?: boolean;
    color?: string;
    presetName?: string;
    inputStyle?: string;
    labelStyle?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    valid?: boolean;
    errorMessage?: string;
    icon?: string;
    iconAlign?: string;
    passwordToggle?: boolean;
    iconShow?: string;
    iconHide?: string;
    iconUpload?: string;
    dropdown?: boolean;
    inputStyle?: string;
    labelStyle?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    valid?: boolean;
    errorMessage?: string;
    icon?: string;
    iconAlign?: string;
    inputStyle?: string;
    labelStyle?: string;
}

interface DropdownProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valid?: boolean;
    errorMessage?: string;
    icon?: string;
    iconAlign?: string;
    inputStyle?: string;
    labelStyle?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: string;
    flat?: boolean;
    block?: boolean;
    outline?: boolean;
    icon?: string;
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    color?: string;
    inputStyle?: string;
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    color?: string;
    inputStyle?: string;
}

interface SegmentedProps extends RadioProps {
    multiSelect?: boolean;
    icon?: string;
}

interface FormBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
    color?: string;
    labelStyle?: string;
    inputStyle?: string;
}

interface ProgressProps extends React.ProgressHTMLAttributes<HTMLProgressElement> {
    'data-icon'?: string;
    'data-icon-align'?: string;
    val?: 'left' | 'right';
    disabled?: boolean;
    color?: string;
    inputStyle?: string;
    labelStyle?: string;
}

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    highlight?: boolean;
    live?: boolean;
    stepLabels?: Array<number>;
    'data-icon'?: string;
    icon?: string;
    tooltip?: boolean;
    val?: 'left' | 'right';
    // value?: number | Array<number>;
    color?: string;
    inputStyle?: string;
    labelStyle?: string;
}

interface RatingProps extends React.InputHTMLAttributes<HTMLInputElement> {
    val?: 'left' | 'right';
    template?: string;
    empty?: string;
    filled?: string;
    value?: number;
    color?: string;
    inputStyle?: string;
    labelStyle?: string;
}

interface FormGroupProps extends React.HTMLAttributes<HTMLElement> {
    collapsible?: boolean;
    open?: boolean;
    inset?: boolean;
}

interface PopupProps extends ClassNameProp {
    style?: React.CSSProperties
}

/**
 * Interface definitions
 * ---------------------
 */

export interface FormComponent extends MbscComponent<MbscFormOptions, React.FormHTMLAttributes<HTMLFormElement>> { }
export interface LabelComponent extends MbscComponent<LabelProps> { }
export interface InputComponent extends MbscComponent<MbscFormOptions, InputProps> { }
export interface TextAreaComponent extends MbscComponent<MbscFormOptions, TextAreaProps> { }
export interface DropdownComponent extends MbscComponent<MbscFormOptions, DropdownProps> { }
export interface ButtonComponent extends MbscComponent<MbscFormOptions, ButtonProps> { }
export interface CheckboxComponent extends MbscComponent<MbscFormOptions, CheckboxProps> { }
export interface RadioComponent extends MbscComponent<MbscFormOptions, RadioProps> { }
export interface SegmentedComponent extends MbscComponent<MbscFormOptions, SegmentedProps> { }
export interface SwitchComponent extends MbscComponent<MbscFormOptions, FormBaseProps> { }
export interface StepperComponent extends MbscComponent<MbscFormOptions, FormBaseProps> { }
export interface ProgressComponent extends MbscComponent<MbscFormOptions, ProgressProps> { }
export interface SliderComponent extends MbscComponent<MbscFormOptions, SliderProps> { }
export interface RatingComponent extends MbscComponent<MbscFormOptions, RatingProps> { }
export interface FormGroupComponent extends MbscComponent<FormGroupProps> { }
export interface FormGroupTitleComponent extends MbscComponent<React.HTMLAttributes<HTMLElement>> { }
export interface FormGroupContentComponent extends MbscComponent<React.HTMLAttributes<HTMLElement>> { }
export interface AccordionComponent extends MbscComponent<React.HTMLAttributes<HTMLElement>> { }
export interface PageComponent extends MbscComponent<MbscPageOptions, React.HTMLAttributes<HTMLElement>> { }
export interface PopupComponent extends MbscComponent<MbscPopupOptions, PopupProps> { }
export interface ScrollerComponent extends InputBaseComponent<MbscScrollerOptions, AnyValueProp> { }

/**
 * Const definitions
 * -----------------
 * Enable the following syntax: import { Calendar } from '@mobiscroll/react'
 */

export const Form: FormComponent;
export const Label: LabelComponent;
export const Input: InputComponent;
export const Textarea: TextAreaComponent;
export const Dropdown: DropdownComponent;
export const Button: ButtonComponent;
export const Checkbox: CheckboxComponent;
export const Radio: RadioComponent;
export const Segmented: SegmentedComponent;
export const Switch: SwitchComponent;
export const Stepper: StepperComponent;
export const Progress: ProgressComponent;
export const Slider: SliderComponent;
export const Rating: RatingComponent;
export const FormGroup: FormGroupComponent;
export const FormGroupTitle: FormGroupTitleComponent;
export const FormGroupContent: FormGroupContentComponent;
export const Accordion: AccordionComponent;
export const Page: PageComponent;
export const Popup: PopupComponent;
export const Scroller: ScrollerComponent;

/**
 * Namespace definitions
 * ---------------------
 * Enable the use of components under the mobiscroll namespace:
 * Ex.: <mobiscroll.Calendar />
 */

export interface IMobiscroll extends _IMobiscroll {
    Form: FormComponent;
    Label: LabelComponent;
    Input: InputComponent;
    Textarea: TextAreaComponent;
    Dropdown: DropdownComponent;
    Button: ButtonComponent;
    Checkbox: CheckboxComponent;
    Radio: RadioComponent;
    Segmented: SegmentedComponent;
    Switch: SwitchComponent;
    Stepper: StepperComponent;
    Progress: ProgressComponent;
    Slider: SliderComponent;
    Rating: RatingComponent;
    FormGroup: FormGroupComponent;
    FormGroupTitle: FormGroupTitleComponent;
    FormGroupContent: FormGroupContentComponent;
    Accordion: AccordionComponent;
    Page: PageComponent;
    Popup: PopupComponent;
    Scroller: ScrollerComponent;
}

export const mobiscroll: IMobiscroll;
export as namespace mobiscroll;
export default mobiscroll;