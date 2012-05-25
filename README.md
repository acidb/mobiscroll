Mobiscroll
==========

A wheel scroller user control optimized for touchscreens to easily enter date and/or time. The control can easily be customized to support any custom values and can even be used as an intuitive alternative to the native select control (dropdown list). It is designed to be used on touch devices as an alternative to the jQuery UI date picker.

The control is themable. You can easily change the appearance of if in CSS. It also comes with pre-defined, nice looking skins (Default, Android, Sense UI and iOS).

By default the control renders for intuitive and easy usage, but you can also customize it's parameters (width, height,...). For more info see the wiki.

See demo here: http://demo.mobiscroll.com

More features and details to follow...

Tested on iOS4, Android 2.2, Android 2.3, Chrome, Safari, Firefox, IE9. Please submit issues, and compatibility problems with other devices.

If you like it, spread the word!

For the latest info follow us on Twitter http://twitter.com/#!/mobiscroll !
Like us on Facebook http://www.facebook.com/pages/Mobiscroll/226962304011802 !

It'd be cool to see how you're using Mobiscroll!
================================================

We're looking at showcasing some of the best work on http://mobiscroll.com . Feel free to let us know on twitter @mobiscroll!

Changelog 2.0
=============

Bugfixes
--------

  * Fixed: setValue / setDate methods did not animate the scroller if time was specified

  * Fixed: In some cases date validation scrolled the day wheel to empty value

  * Fixed: Datetime preset's setDate and getDate methods were using last created instance's resources

  * Fixed: Select options were reordered, if values were numbers

  * Fixed: When using option method to change options on the fly, preset and theme defaults overrode user settings


Changelog 2.0rc3
================

Bugfixes
--------

  * Fixed: In clickpick mode minus button had plus button behavior

  * Fixed: In inline mode getValue always returned the initial values

  * Fixed: min/max attributes were incorrectly parsed when using HTML5 time input

Enhancements
------------

  * Added: _invalid_ option for the datetime preset to set dates unselectable. There are three properties to specify dates, all can be used separate or combined. _dates_ is be an array of dates to disable exact dates on the scroller. _daysOfWeek_ is an array with values from 0 to 6, _daysOfMonth_ is an array which accepts numbers (e.g. every month's 2nd day) or a string in 'x/y' format (e.g. 12/24 means every year's 24th December is disabled). A sample configuration: invalid: { dates: [new Date(2012,5,4), new Date(2012,5,13)], daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] }

  * Added: The select preset automatically disables elements on the scroller if they were disabled in the original html select element



Changelog 2.0rc2
================

Removed
-------

  * Removed: _ampm_ option is now removed, see the new _timeWheels_ option instead

  * Removed: _seconds_ option is now removed, see the new _timeWheels_ option instead

Changes
-------

  * Changed: _preset_ option no longer defaults to 'date', *it must be explicitly specified!*

  * Changed: _wheels_ option no defaults to empty array ([]) instead of null

  * Changed: valid scroller items now have the class "dw-v" instead of "valid"

  * Changed: in 2.0rc1 days not in month were styled as disabled, like items out of the min/max range. From now on days not in month now have the class "dw-h" which, by default has a hidden style in css.

Bugfixes
--------

  * Fixed: Inline mode bug with jQuery Mobile, if it was not on the initial page

  * Fixed: Select preset was not working in inline mode

Enhancements
------------

  * Added: _headerText_ can accept a function, which must return a string

  * Added: Day of week can be displayed on the scrollers. Use 'D' (short names) or 'DD' (long names) in the _dateOrder_ options. Sample _dateOrder_ value: 'mmD ddy' will produce '05', 'Thu 03', '2012' on the day, month and year wheels.

  * Added: _separator_ option used by the datetime preset to specify the separator between date and time parts. Default is ' '.

  * Added: _readonly_ option, if true, the scroller appears, but cannot be scrolled. Useful if you want to display a nice clock.

  * Added: _timeWheels_ option to show, hide, and format the time related wheels on the scroller. Default is 'hhiiA'. For the hour wheel use 'h', 'hh', 'H', 'HH', for minutes wheel 'i' or 'ii', for seconds wheel 's' or 'ss', for am/pm wheel 'A' or 'a'. E.g. for 24 hour time format with seconds and leading zeroes use 'HHiiss'.

  * Added: support for HTML5 date/datetime/datetime-local/month/time input types. If mobiscroll is attached to such an input, the format is forced to follow standards specifications. In the popup header the value is formatted according to the date and timeformat specified by the user.

Changelog 2.0rc1
================

Structural changes
------------------

Mobiscroll has now a modular structure. The core contains the wheel generation and scrolling logic. The core can be extended by presets.
Presets are basically a collection of predefined settings, which are passed to the core, but may contain other initialization logic, which is executed when the scroller instance is created.

Currently you can include the 'date', 'time', 'datetime' and 'select' presets.

Themes are now also modular, css styles are in separate files for each theme. Themes may have an optional javascript file, where default settings can be set, and an optional init function as well.

Removed
-------

  * Removed: _beforeShow_ event is now removed

  * Removed: _showValue_ option is now removed, use the _headerText_ option instead

  * Removed: _btnClass_ option is now removed, button style can be changed by adding css rules to the .dwb class

Bugfixes
--------

  * Fixed: Android ICS Light skin fix (small +/- appeared above/under arrows)

  * Fixed: _onSelect_ and _onCancel_ events are now called after the popup is closed and all the form elements on the page are re-enabled, making possible to submit the form in these events.

  * Fixed: In custom events *this* refers to the original HTML DOM element instead of the settings object

Enhancements
------------

  * Changed: The visibility of year, month and day wheels is now controlled by _dateOrder_ option, e.g. use *'mmyy'* to display month and year wheels only

  * Added: _display_ option, which can be *'inline'* or *'modal'* (default)

  * Added: _headerText_ option to specify a custom string which appears in the popup header. If the string contains *'{value}'* substring, it is replaced with the formatted value of the scroller. If _headerText_ is set to *false*, the header is hidden.

  * Added: _onShow_ event

  * Added: _delay_ option to specify the speed in milliseconds to change values in clickpick mode with tap & hold, default is *300*

  * Added: jQuery Mobile theme, set _theme_ option to *'jqm'*

  * Added: *'select'* preset to enhance a regular HTML select. The original select is hidden, and a dummy input is visible instead. The value of the select is maintained by the preset

  * Added: _minDate_ and _maxDate_ options to specify a range which can be selected. Works for datetime as well.

Changelog 1.6
===============

Bugfixes
--------

  * Fixed: Tap & hold changes the value on a 300ms interval instead of 200ms (for slower devices)

  * Fixed: When using custom wheels, parseValue function defaults to first value on the wheel, if cannot parse the input value to a valid wheel value

Enhancements
============

  * Added: _showLabel_ option - show/hide labels on the top of the wheels, default is *true*

  * Added: _showValue_ option - show/hide formatted value in the header of the popup, default is *true*

  * Added: Android ICS ('android-ics') and Android ICS Light ('android-ics light') skins

Changelog 1.5.3
===============

Bugfixes
--------

  * Fixed: Mouse scroll wheel works now with jQuery 1.7+

  * Fixed: Don't always parse input value on show, only if changed

  * Fixed: Time was incorrectly parsed, if there was no date

Changelog 1.5.2
===============

Bugfixes
--------

  * Fixed: First selected value did not work correctly by default for custom scrollers

  * Fixed: Incorerect parsing of am/pm time for 12:xx AM

Enhancements
------------

  * Added: animation on touchend/mouseup event

  * Added: full CSS3 support for Opera 11 and IE10

Changelog 1.5.1
===============

Bugfixes
--------

  * Fixed: Destroy didn't set correctly the original readonly state of the input element.

  * Fixed: Input element is not set to readonly if showOnFocus is false

  * Fixed: Disabled state of form inputs was not correctly reset after hiding the scroller.

  * Fixed: Don't show scroller if disabled and show is called programatically.

Enhancements
------------

  * Added: if the onClose handler returns false, close is now prevented.

  * Added: onCancel event handler.

Notes
-----

  * From now we are using .prop to set readonly/disabled states. This means thet jQuery >= 1.6 is required.

Changelog 1.5
=============

Bugfixes
--------

  * Fixed: _setDate_ method incorrectly sets year, when _seconds_ option is *false*

Enhancements
------------

  * Added: _mode_ option, with two possible values: 'scroller' and 'clickpick', where 'scroller' is the default behaviour, while 'clickpick' renders + and - buttons for each wheel (Android style).

  * Added: new and updated skins: Android, Sense UI, iOS. Set the _theme_ option to 'android', 'sense-ui' and 'ios'

Notes
-----

  * Support for jQuery Mobile 1.0beta1 is now removed (click event was not working). Upgrade to beta2 to use the latest version of MobiScroll.

Known Issues
------------

  * 'Scroller' mode is still not working in Firefox Mobile and IE on WP7

  * When using 'Clickpick' mode, very fast taps causes page zoom on HTC Android.

Changelog 1.0.2
===============

Bugfixes
--------

  * Fixed: Click bleedtrough and focus holding with JQM beta 1
  * Fixed: Missing hour 0 on timepicker

Enhancements
------------

  * Added: Date format options for date wheels through the dateOrder option
