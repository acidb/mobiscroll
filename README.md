MobiScroll
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
