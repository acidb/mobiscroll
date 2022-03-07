Mobiscroll
==========

What is Mobiscroll?
-----------------
Mobiscroll is a UI library for progressive webapps and hybrid development. Created with a lot of attention to usability and performance. [Mobiscroll Forms](https://mobiscroll.com/forms) ships with 15 customizable controls that you can use for free that are included in this repository. For advanced functionality use Forms with:

* [Event calendar & Scheduler](https://mobiscroll.com/event-calendar-scheduler)
* [Datetime pickers & Calendars](https://mobiscroll.com/date-time-picker-calendar)
* [Select, pickers & dropdowns](https://mobiscroll.com/select-pickers-scroller-dropdown)
* [Listview & card layout](https://mobiscroll.com/listview-with-cards-gestures)

Where can I use Mobiscroll?
-----------------
You can use the controls in mobile/desktop web and hybrid cross-platform apps. Use it with React and frameworks like Ionic for React.

Installation
-----------------

Mobiscroll Forms for React is available as an npm package.

    npm install @mobiscroll/react-lite --save

Usage
-----------------

A simple usage example using ES2015 class syntax:

    import React from 'react';
    import ReactDOM from 'react-dom';
    import mobiscroll from '@mobiscroll/react-lite';

    class App extends React.Component {
        render() {
            return (
                <mobiscroll.Form theme="mobiscroll">
                    <mobiscroll.Input name="username">Username</mobiscroll.Input>
                    <mobiscroll.Input name="password" type="password">Password</mobiscroll.Input>
                    <mobiscroll.Button type="submit">Sign In</mobiscroll.Button>
                </mobiscroll.Form>
            );
        }    
    });

    ReactDOM.render(
        <App />,
        document.getElementById("app")
    );

Make sure to load the styles as well. The method of loading css styles may vary depending on the project type and module bundler you use.
A typical setup is using webpack's [css-loader](https://webpack.js.org/guides/code-splitting-css/#importing-css), optionally combined with the 
[ExtractTextWebpackPlugin](https://webpack.js.org/plugins/extract-text-webpack-plugin/). With this configuration you can simply import the css
as well in the js file, where Mobiscroll components are used:

    import '@mobiscroll/react-lite/dist/css/mobiscroll.min.css';

Elements
-----------------

#### Single and multiline text ([live example](https://demo.mobiscroll.com/react/inputs-fields))

Text fields are the backbone of every form. Use it to capture a wide range of properties from plain text to passwords.

Use labels, icons, placeholders or a combination of them to help users get meaning at a glance. Show/hide functionality built in for password fields.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/text-input.png?raw=true" width="50%">

#### Select styling ([live example](https://demo.mobiscroll.com/react/inputs-fields/select))

Similar to the single line input styling, it features a chevron/dropdown arrow to clearly signal the difference between select and text input.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/select-styling.png?raw=true" width="50%">

#### Buttons ([live example](https://demo.mobiscroll.com/react/buttons))

Buttons with different states, styles and alignments. Inline or raised, left aligned, right aligned, centered or justified. Full-width buttons supported as well.

Use it with or without icons.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/buttons.png?raw=true" width="50%">

#### Segmented control ([live example](https://demo.mobiscroll.com/react/buttons/segmented))

Easily lay out two to five options for single and multiple select. Making all options instantly visible lets users make selections with a single interaction instead of at least 3 (tap to open select, do the select, hit set - like for the traditional dropdown).

<img src="https://github.com/acidb/mobiscroll/blob/master/img/segmented.png?raw=true" width="50%">

#### Checkbox and checklist ([live example](https://demo.mobiscroll.com/react/toggle-radio))

Similar to the native checkbox in functionality but a look and feel that fits with the overall user experience and theme. Features description text, checkbox list and disabled styling.

Excellent choice for inline multi-select lists.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/checkbox.png?raw=true" width="50%">

#### Radio button list ([live example](https://demo.mobiscroll.com/react/toggle-radio/radio-button))

Single select for a list of options. Use it instead of the segmented control if there are more items that would fit in a single line.

Usually a good choice for five options and above. Features disabled styling and optional description.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/radio.png?raw=true" width="50%">

#### Switch ([live example](https://demo.mobiscroll.com/react/toggle-radio/switch))

Just like the checkbox, the switch lets users turn options on/off. Can be rendered as a list of fields, like the checkbox list or as a stand-alone control.

Features optional description and disabled styling.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/switch.png?raw=true" width="50%">

#### Stepper ([live example](https://demo.mobiscroll.com/react/buttons/stepper))

When users need to make small adjustments to values by increasing or decreasing it avoid free-form input and dropdowns. Steppers help in minimizing mistakes, and reduce the number of taps for getting the values right.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/stepper.png?raw=true" width="50%">

#### Page and typography ([live example](https://demo.mobiscroll.com/react/styling))

Takes care of setting the background colors, spacing and typographic styling. It makes sure that the content you add shows up nicely on any screen-size.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/typography.png?raw=true" width="50%">

#### Slider ([live example](https://demo.mobiscroll.com/react/slider-progress))

Work your way from a monotone, dropdown heavy form to an easily scannable page by switching controls. Consider using sliders for selecting one or multiple values from a range.

Continuous ranges, steps, floating value display, disabled styling and usage with icons is supported out of the box.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/slider.png?raw=true" width="50%">

#### Progress ([live example](https://demo.mobiscroll.com/react/slider-progress/progress))

Provide visual feedback to the user. Reduce anxiety and help people understand progress with the control. You can also use it as a completness meter to show how the user does on completing a purchase.

With a powerful API control the state, value programtically and restart, pause it if you need to.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/progress.png?raw=true" width="50%">

#### Alert, confirm and prompt ([live example](https://demo.mobiscroll.com/react/alerts-notifications))

Show alert messages, confirmation dialogs and prompt for focused value entry. Supporting platform specific look & feel, make your users feel at home and communicate what they actually need to see.

These controls cannot be dismissed by pressing the overlay, avoiding closing it by mistake.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/alert.png?raw=true" width="50%">

#### Toast and snackbar ([live example](https://demo.mobiscroll.com/react/alerts-notifications/notifications))

Keep your users up to date with notifications. Either in form of a toast or a snackbar.

Choose to provide an action with the message, like UNDO or RETRY, something that helps the user make progress faster towards their desired goal.

<img src="https://github.com/acidb/mobiscroll/blob/master/img/notifications.png?raw=true" width="50%">

Commercial Components
-----------------

#### Date & time pickers

* [Calendar](https://demo.mobiscroll.com/react/calendar)
* [Date & Time](https://demo.mobiscroll.com/react/datetime)
* [Range](https://demo.mobiscroll.com/react/range)
* [Timespan](https://demo.mobiscroll.com/react/timespan)

#### Event calendar

* [Agenda](https://demo.mobiscroll.com/react/agenda)
* [Calendar view](https://demo.mobiscroll.com/react/eventcalendar)
* [Scheduler](https://demo.mobiscroll.com/react/scheduler)

#### Pickers & dropdowns

* [Select](https://demo.mobiscroll.com/react/select)
* [Scroller](https://demo.mobiscroll.com/react/scroller)
* [Treelist](https://demo.mobiscroll.com/react/list)
* [Image](https://demo.mobiscroll.com/react/image)
* [Color](https://demo.mobiscroll.com/react/color)
* [Optionlist](https://demo.mobiscroll.com/react/optionlist)

#### Pickers & dropdowns

* [Numpad](https://demo.mobiscroll.com/react/numpad)
* [Number](https://demo.mobiscroll.com/react/number)
* [Measurement](https://demo.mobiscroll.com/react/measurement)

#### Gesture enabled responsive list

* [Listview](https://demo.mobiscroll.com/react/listview)
* [Scrollview](https://demo.mobiscroll.com/react/scrollview)
* [Cards](https://demo.mobiscroll.com/react/cards)

Documentation
-----------------
For the complete documentation of Mobiscroll Forms and all products, please visit https://docs.mobiscroll.com/react

Demos and examples
-----------------
- Demos for Mobiscroll Forms (FREE) can be found at https://demo.mobiscroll.com/react/forms
- Over 250 live demos with downloadable code can be found at https://demo.mobiscroll.com

Getting help
-----------------
- Report bugs to the [issues list](https://github.com/acidb/mobiscroll/issues?q=is%3Aopen) for all Mobiscroll products.
- Browse the [learning section](https://mobiscroll.com/support) and [help center](http://help.mobiscroll.com) for resources and more information on the products.
- Submit and answer questions on [StackOverflow](http://stackoverflow.com/questions/tagged/mobiscroll) with the 'mobiscroll' tag.
- Join the [community forum](https://forum.mobiscroll.com).

The Mobiscroll team does not provide technical support for Mobiscroll Lite. To get support from the team [purchase a license](https://mobiscroll.com/pricing) or join the [community forums](https://forum.mobiscroll.com)

Release notes
-----------------
For the complete release history and changelog visit https://mobiscroll.com/releases

Get in touch
-----------------
Contact https://mobiscroll.com/contact

Twitter http://twitter.com/mobiscroll

Facebook https://www.facebook.com/mobiscroll

License Information
-----------------

This project has been released under the Apache License, version 2.0, the text of which is included below. This license applies ONLY to the source of this repository and does not extend to any other Mobiscroll distribution or variant, or any other 3rd party libraries used in a repository. For licensing information about Mobiscroll, see the [License Agreements page at mobiscroll.com](https://mobiscroll.com/eula).

>Copyright © 2021 Mobiscroll

>Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

>http://www.apache.org/licenses/LICENSE-2.0

>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
