Mobiscroll
==========

What is mobiscroll?
-----------------
Mobiscroll is a library of Touch UI Components created with a lot of attention to usability and performance. The Components are based on the powerful and highly customizable Mobiscroll Core.

Where and how can I use mobiscroll?
-----------------
You can use mobiscroll components in your web and mobile apps for making data picking and navigation easy. It works with jQuery, jQuery Mobile, Zepto.JS and Intel App Framework (formerly known as jQMobi). You can also use it to develop hybrid apps with PhoneGap. You can use it in Windows 8 and Windows Phone 8 apps as well.
Mobiscroll at its core is a javascript library so it runs everywhere where javascript can be executed. It is a great companion to all frameworks and libraries like Kendo UI, Backbone JS, Bootstrap, Angular JS, Knockout JS ....

See demos
-----------------
http://demo.mobiscroll.com



Supported on iOS 4-7, Android 2.2 - 4.4, Windows Phone 8, BlackBerry,  Amazon Kindle, Chrome, Safari, Firefox, IE9-11. Please submit issues, and compatibility problems with other devices.

_If you like it, spread the word!_

Twitter http://twitter.com/mobiscroll

Facebook https://www.facebook.com/mobiscroll

Google+ https://plus.google.com/+MobiscrollUI


It'd be cool to see how you're using Mobiscroll!
-----------------

We're looking at showcasing some of the best work on http://mobiscroll.com . Feel free to let us know on twitter @mobiscroll!

Changelog 2.11.0
================

_Core_

  * Added: `rtl` setting for right to left support.

_Datetime_

  * Added: Support for invalid ranges.

  * Added: `valid` setting to override invalid dates.

_Languages_

  * Added: Persian translation and support for jalali dates.

_List_

  * Fixed: Support for `data-val="0"` (#223).

_Listview_

  * Added: Undo functionality.

  * Added: `itemGroups` setting for defining different settings (actions, stages, tap) for different list items.

  * Added: `altRow` setting for alternate line colors.

  * Added: `fixedHeader` setting for fixed group headers.

_Themes_

  * Changed: `android-ics` renamed to `android-holo`.

_Windows Phone Theme_

  * Changed: PNG images are replaced with font icons.


Changelog 2.10.1
================

Enhancements
------------

_Core_

  * Added: `preventFocus` parameter for the `show` method.

  * Added: automatic liquid layout based on screen size.

_Integration_

  * Added: support for hiearchical listview in Knockout, Angular and Backbone integration plugins.

Bugfixes
--------

_Rating_

  * Fixed: Vertical alignment was incorrect with Windows Phone theme.


Changelog 2.10.0
================

Enhancements
------------

_Calendar_

  * Added: Support right to left languages with the `rtl` setting.

  * Added: Support for displaying icons on marked days.

_Datetime_

  * Added: `yearSuffix`, `monthSuffix`, `daySuffix` settings for improved localization (#142).

_List_

  * Added: `placeholder` setting for the generated input field.

_Listview_

  * Added: `disabled` property for `stage` or `action` setting.

  * Added: support for hierarchical lists.

_Rating_

  * Added: Font icons are now used instead of images, icons can be changed with the `iconFilled` and `iconEmpty` settings.

  * Added: `placeholder` setting for the generated input field.

_Rangepicker_

  * Added: `autoCorrect` setting to disable automatic date adjustment if end is earlier than start.

_Select_

  * Added: `placeholder` setting for the generated input field.


Bugfixes
--------

_Core_
  
  * Fixed: Prevent virtual keyboard popup on some devices (#216).

  * Fixed: Page scrolled to bottom in IE and FF on show (#214).

_Datetime_

  * Fixed: Hour, minute and second steps are now calculated from minimum time, if specified (#204).

_Select_
    
  * Fixed: Select scroller whithout value attributes now can be selected (#215).



Changelog 2.9.5
===============

Bugfixes
--------

_Core_

  * Fixed: Tap on items did not work correctly on Android 2.3

  * Fixed: Tap on overlay caused bleed-through on Android 2.3

  * Fixed: Fallback to english locales if a language is not found (#210).

  * Fixed: Animations are disabled now on Android 2.3

_Calendar_

  * Fixed: Page was not scrollable from the calendar if in inline mode or calendar was larger than the screen.

  * Fixed: If in inline mode, months swipe was broken if used with page transitions on some devices.

  * Fixed: Month swipe worked incorrectly with min/max date set.

_Datetime_

  * Fixed: fix for parseDate and formatDate utility functions (#209).

  * Fixed: minDate and maxDate did not work correctly (#212).

_Timer_

  * Fixed: Display fixes for ios, ios7 and android-ics themes.

_Treelist_

  * Fixed: Wheels were not always hidden if tree had different levels (#211).



Changelog 2.9.4
===============

Enhancements
------------

_Core_

  * Changed: Mobiscroll is focused on popup to make keyboard navigation easier (#150).

  * Changed: Using css flexible box model for wheel distribution. Falls back to table layout on devices without flex support (IE8 and IE9).

  * Changed: Improved Firefox compatibility.

  * Added: layout setting, can be 'fixed' or 'liquid'.

  * Added: multiline setting to wrap the wheel item content into multiple lines.

_Rangepicker_

  * Changed: Initial range is now today + 7 days.

_Listview_

  * Added: animation setting, if set to false no animation will occur. Default is true.

_Localization_

  * Added: Romanian, Polish, Russian (UA) translations.
  

Bugfixes
--------

_Core_


_Calendar_

  * Fixed: Keyboard navigation issues.

_Measurements_

  * Fixed: Value is constrained between min and max if set from input or with setValue method.

  * Fixed: setValue did not work correctly if value was passed as an array (#188).

_Select_

  * Fixed: getValue method was not working correctly in group mode (#202).

_Themes_

  * Fixed: Auto theme chooser did not detect iOS7 correctly (#207).

_Treelist_

  * Fixed: Readonly setting was not working correctly (#203).



Changelog 2.9.3
===============

Enhancements
------------
_Core_

  * Added: activeInstance variable.

_Calendar_

  * Added: months setting now accepts 'auto' to automatically determine the number of months to display.

_Datetime_

_Rangepicker_

  * Added: setActiveDate method.

_Listview_

  * Added: pixel units changed to em. 

  * Added: swipe setting accepts multiple values: true, false, 'left', 'right', or a function.

  * Added: onSlideStart event.

  * Added: List dividers are now supported by adding data-role="list-divider" attribute to one ore more list elements.

  * Added: sortable setting can be true, false, or 'group'. If 'group', sort is allowed only inside the group defined by the list dividers.

  * Added: actions setting to display a list of icons under the slided list item. If an icon is tapped, the corresponding action will be executed, otherwise the list item slides back.
  
Bugfixes
--------

_Core_

  * Fixed: If a default theme or language was set using setDefaults, theme and language settings were not loaded.

_Calendar_

  * Fixed: closeOnSelect setting caused event bleedthrough on some iOS versions.

  * Fixed: closeOnSelect now always disables divergentDayChange setting.

_Listview_

  * Fixed: Incorrect this reference in action function if called after confirmation.

  * Fixed: Icon slide issue when more than one listview was present on the page (#198).

_Themes_

  * Fixed: WP theme fix for clickpick buttons active style.


Changelog 2.9.2
===============

Enhancements
------------

_Datetime_

  * Added: amText and pmText localization settings.

_Rangepicker_

  * Added: getValue method can now return temporary start and end dates (if set button is not yet clicked).

_Localization_

  * Added: en-UK locale settings.

Bugfixes
--------

_Core_

  * Fixed: setDefaults method didn't work.

  * Fixed: null value is set if all options are disabled on a wheel (#196).

_Calendar_

  * Fixed: closeOnSelect setting didn't work correctly.

  * Fixed: Orientationchange from landscape to portrait didn't work correctly if tabs were present.

_Listview_

  * Fixed: Icon and text was not visible with iconSlide setting if used with jQuery Mobile listview.

_Themes_

  * Fixed: Incorrect border radius for active buttons in Android ICS theme (#195).



Changelog 2.9.1
===============

Enhancements
------------

_Listview_

  * Added: handle setting - allows sort if touch started on the handle.

Bugfixes
--------

_Core_

  * Fixed: btn parameter was undefined in onClose if clear button was pressed (#181).

_Angular JS Integration_

  * Fixed: Directive for select preset now works for dynamically generated options.

_Listview_

  * Fixed: Slide was not working in Android 4.0.x.

  * Fixed: Confirm tap incorrectly fired onItemTap as well.

_Rangepicker_

  * Fixed: Range picker incorrect bubble positioning with start and end inputs present (#183).

  * Fixed: setValue method was not working correctly (#189).

_Themes_

  * Fixed: z-index issue with jqm theme (#187).

_Timespan_

  * Fixed: minTime / maxTime worked incorrectly (#184).


Changelog 2.9.0
===============

Enhancements
------------

_Calendar_

  * Added: Holding month and year buttons changes month/year until released.

  * Added: months setting to display multiple months.

_Listview_

  * Added: onStageChange event.

  * Added: onItemTap event.

  * Added: onSlideEnd event.

  * Added: slideIcon setting - icon and text can be positioned to move with the slided element.

  * Added: quickSwipe setting - on quick swipe (less than 300ms and 50px of movement) the first stage's action is executed.

  * Added: confirm option for stage actions.

  * Added: move method.

_Rangepicker_

  * Added: rangeTap setting for faster range selection.

_Select_

  * Added: showInput setting, if false hide the input

_Themes_

  * Added: Plugin which decides the theme based on User Agent.

Bugfixes
--------

_Core_

  * Fixed: Higher z-index to show over jQuery Mobile popups.

_Calendar_

  * Fixed: Changing tabs sometimes messed up the month slider.

_List_

  * Fixed: In live mode values were not always filled in the input.

_Listview_

  * Fixed: adding item didn't work correctly on empty list.

  * Fixed: don't remove list item inline styles on sort end.



Changelog 2.8.3
===============

Enhancements
------------

_Calendar_

  * Added: data-day attribute for calendar days to allow styling of weekdays (#173).

_Listview_

  * Added: scroll window if element is dragged out of viewport.

  * Added: Callback functions to add and remove methods.

Bugfixes
--------

_Core_

  * Fixed: setDefaults method now works.

  * Fixed: Positioning works now correctly with horizontal scroll.

_Listview_

  * Fixed: Placeholder was not placed in some cases.

_Measurements_

  * Fixed: Incorrect conversion with setValue method.

_Rating_

  * Fixed: parseValue fixed.

_Themes_

  * Fixed: WP theme calendar tab padding issues fixed.


Changelog 2.8.2
===============

Enhancements
------------

_Listview_

  * Added: sort setting for reordering lists with onSortStart, onSortStop, onSort, onChange, onUpdate events.

  * Improved: add and remove animations.

_Themes_

  * Added: Bootstrap integration.

Bugfixes
--------

_Calendar_

  * Fixed: Use deep copy when setting events.

_Timer_

  * Fixed: Button icons were of with WP theme.

_Timespan_

  * Fixed: Labels were incorrectly shown with the iOS theme.


Changelog 2.8.1
===============

Enhancements
------------

_Listview_

  * Added: New listview component.

_Core_

  * Changed: Attach event handlers with latency to improve compatibility with libraries like fastclick.js.

_Calendar_

  * Changed: Removed jqm specific behavior.

  * Changed: Divergent day change is disabled by default.

_Rangepicker_

  * Changed: Remove jqm specific behavior.

_Themes_

  * Changed: Calendar respects the swatch set by the jqmBody setting.

Bugfixes
--------

_Core_

  * Fixed: Remove mobiscroll markup without timeout if no animation.

_Calendar_

  * Fixed: Tab key focus works is enabled on visible month only.

  * Fixed: Swipe was broken in Android stock browser after opening a native select or virtual keyboard.

_Rangepicker_

  * Fixed: Date and time was incorrectly set on scrollers when invoked from start or end input.

_Themes_

  * Fixed: Background fix for WP, iOS, iOS7 themes in clickpick/mixed mode.

Changelog 2.8.0
===============

Enhancements
------------

_Core_

  * Added: 'context' setting (#143).

  * Added: generic buttons.

  * Added: 'minWidh', 'maxWidth' and 'fixedWidth' settings (#112).

  * Changed: default theme was updated.

_Calendar_

  * Added: start/end times for multi day events.

  * Added: when a day clicked from another month changes the month and show the event bubble.

  * Added: 'counter' option to show number of selected items in header (if in multi-select mode).

  * Added: live swipe ('liveSwipe' setting).

  * Added: 'showDivergentDays' setting to show/hide days from previous and next months.

  * Added: 'divergentDayChange' setting to enable/disable month change on divergent day selection.

  * Changed: week numbers are not sliding.

_Datetime_

  * Added: invalid time ranges (#94, #147).

_Rangepicker_

  * Added: 'counter' setting to show number of selected items in header.

_Select_

  * Added: 'counter' setting to show number of selected items in header.

Bugfixes
--------

_Core_

  * Fixed: In bubble mode positioning sometimes ended up in endless scrolling.

  * Fixed: If another mobiscroll element was under the overlay, it opened on tap.

  * Fixed: No more blue highlight on wheel tap in Android 4.x.

  * Fixed: Context got lost in some cases (#163).

_Select_

  * Fixed: hiding the original select is not good for validation (#161).

_Treelist_

  * Fixed: animation was not working with setValue method.


Changelog 2.7.2
===============

Enhancements
------------

_Core_

  * Added: Hide set and cancel buttons if their value is false (#134).

  * Added: closeOnOverlay setting.

  * Added: Live mode. If 'Set' button is not present, the value and input is updated on every change.

_Timespan_

  * Added: minTime and maxTime settings.

_Calendar_

  * Changed: Improved performance on month change.

  * Changed: Refresh calls are postponed until the end of month change animation.

  * Added: closeOnSelect setting to hide the calendar when a day is selected.

_Rangepicker_

  * Added: Show/hide on focus and tap is automatically bind to start and end inputs (if any).

_Languages_

  * Added: Swedish translation, thanks to Johan Jönsson (https://github.com/jonixj)

  * Added: European Portuguese translation, thanks to Jorge Simões (https://github.com/jorgefsimoes)

_Themes_

  * Added: iOS7 theme.

Bugfixes
--------

_Core_

  * Fixed: Mobiscroll was shown again after close in IE with jQuery < 1.9.

  * Fixed: Destroy hides scroller without animation.

  * Fixed: Destroy is called on the element before init preventing re-initialization bugs.

  * Fixed: .mobiscroll('getInst') correctly returns the instance during initialization.

  * Fixed: Positioning fixes on resize/orientationchange/scroll.

  * Fixed: Was not working correctly with fastclick.js.

  * Fixed: Tap was not working in IE10 with touch events (#118).

  * Fixed: Clicking blank space selects last item (#159).

_Calendar_

  * Fixed: Incorrect width calculation when tabs set to 'auto'.

  * Fixed: Event list was not clipped in Firefox Mobile when scrolled.

_Rating_

  * Fixed: If created from select, anchor was not correct for bubble positioning.


Changelog 2.7.0
===============

Enhancements
------------

_Core_

  * Changed: Mobiscroll value is automatically updated on input change, this way setValue method is working properly (#79).

  * Added: Utility object exposing some useful variables, currently vendor prefix and 3d support ($.mobiscroll.util.prefix and $.mobiscroll.util.has3d).

  * Added: onDestroy event.

_Calendar_

  * Changed: Invalid and marked settings have now a different format. Old format is still working but it is considered deprecated and will be removed in the next major release. See documentation for details.

  * Added: events setting to pass any number of events. Events are shown in a context bubble. See documentation for details.

_Colorpicker_

  * Added: defaultValue setting to specify default color.

_Daterange_

  * Added: This is new component for daterange selection.

_Datetime_

  * Changed: Invalid values have now a different format. Old format is still working but it is considered deprecated and will be removed in the next major release. See documentation for details.

  * Added: defaultValue setting to specify default date.

_List_

  * Added: defaultValue setting.

_Measurements_

  * Added: defaultValue setting.

_Rating_

  * Added: defaultValue setting.

_Themes_

  * Added: Support for jQuery Mobile 1.4.0-alpha1.

_Timespan_

  * Added: defaultValue setting.

Bugfixes
--------

_Core_

  * Fixed: Mixed mode was not working (#141).

_Calendar_

  * Fixed: Calendar header buttons were not disabled on show, only after first month change.

_Datetime_

  * Fixed: 'Now' button did not trigger the onChange event (#145).

_Timer_

  * Fixed: On destroy timer interval wasn't stopped.

_Timespan_

  * Fixed: setValue was not working, if value was out of wheel range.

_Themes_

  * Fixed: Header was not hidden correctly in android-ics, android, jqm and sense-ui themes.


Changelog 2.6.2
===============

Bugfixes
--------

_Core_

  * Fixed: Tap was not removed from element on destroy.

  * Fixed: Mouse scroll wheel now works with Zepto and jqMobi.

  * Fixed: Whitespace after buttons in Firefox.

  * Fixed: After hide scroller was shown again in IE.

_Calendar_

  * Fixed: Fixed swipe animation in Firefox / Android.

_Animation_

  * Fixed: Flickers on Firefox.


Changelog 2.6.1
===============

Enhancements
------------

_Core_

  * Added: Accessibility features - keyboard shortcuts and WAI-ARIA attributes (#48).

  * Added: Reposition scroller if scroll occurs (#106).

  * Added: showOnTap option.

  * Changed: Use on/off for attaching and detaching events instead of bind/unbind/delegate.

_Select_

  * Added: Accessibility features - keyboard shortcuts and WAI-ARIA attributes for multiselect mode.

_Calendar_

  * Added: Accessibility features - keyboard shortcuts and WAI-ARIA attributes for calendar.

  * Changed: Improved month change animation.

_Colorpicker_

  * Added: Accessibility features - keyboard shortcuts and WAI-ARIA attributes.

_Rating_

  * Added: Accessibility features - keyboard shortcuts and WAI-ARIA attributes.

_Timer_

  * Added: Accessibility features - keyboard shortcuts and WAI-ARIA attributes.

Bugfixes
--------

_Core_

  * Fixed: Mouse scroll wheel now works with Zepto and jqMobi.

  * Fixed: +/- buttons were shortly hidden during animation.

  * Fixed: Wheel was incorrectly labeled if empty string was passed.

_Select_

  * Fixed: Group label was incorrect.

_Rating_

  * Fixed: Layout was broken in Firefox / Android with stars + text.

_Timer_

  * Fixed: WP theme top padding removed.

_Languages_

  * Fixed: dateOrder and dateFormat corrected for Hungarian language.


Changelog 2.6.0
===============

Enhancements
------------

_Core_

  * Changed: Refactored method calls resulting in smaller file size.

  * Changed: New wheel format using arrays instead of objects to maintain the order of items. Old wheel format is still supported, but deprecated. See documentation for details.

  * Changed: Cleaned up css.

  * Changed: position method is now public.

  * Changed: Remove setInterval which was running to get update the actual position of a moving wheel. Position is now dynamically calculated only when needed.

_Calendar_

  * Changed: Performance improved when calendar is updated when moving the wheels on the scroller.

  * Added: Month and year can be changed sepparately in the header.

  * Added: Month and year order in calendar header is now controlled by the 'dateOrder' setting (#122).

  * Added: Tabs for calendar, date, and time controls. Displaying tabs can be automatical (if there is not enough space for all the controls), always on, or always off.

  * Added: Custom color for marked sign and event background.

  * Added: Different styling for marked days (colored bottom line).

_Languages_

  * Added: Dutch translation (Thanks to Sven-Depondt - https://github.com/Sven-Depondt).

  * Added: Turkish translation (Thanks to Metin Gökhan Ünal).

  * Added: Japanese translation (Thanks to Johnny Shields - https://github.com/johnnyshields).

Bugfixes
--------

_Core_

  * Fixed: Firefox / IE display bug, wheel groups were shown under each other, even if there was enough space (#104).

  * Fixed: Form fields remained disabled in Firefox if page was reloaded before hiding mobiscroll (#126).

  * Fixed: Call stopPropagation on move event to make it work correctly with iScroll (or similar libraries) (#14).

  * Fixed: settings property is now correctly exposed (object reference is kept).

_Calendar_

  * Fixed: "dayOfWeek: [0]" was not working for marked days.

  * Fixed: Date passed to the onDayChange event was not always correct.

_Select_

  * Fixed: In multiselect mode old checkmarks were not removed when setValue method was called (#129).

_Temperature_

  * Fixed: "°K" changed to "K" on unit wheel (#124).

_Animation_

  * Fixed: Added "-webkit-backface-visibility: hidden;" to some elements to prevent animation glitches in webkit.

_jqMobi_

  * Fixed: css function returned NaN for margin in outerWidth function.


Changelog 2.5.4
===============

Enhancements
------------

_Core_

  * Changed: Transition is done by directly editing the property instead of the style attribute (#59).

Bugfixes
--------

_Core_

  * Fixed: wheel overlay was blinking during animation.

  * Fixed: wheel overlay sometimes did not cover the whole wheel (on Google Chrome and Android stock browser).

  * Fixed: showLabel setting now works for all themes.


Changelog 2.5.3
===============

Enhancements
------------

_Core_

  * Added: onPosition event.

_Languages_

  * Added: zh-cn language pack.

_Calendar_

  * Changed: Month change on swipe is now improved and more fluid.

  * Added: Text can be added to marked days.

  * Added: weekCounter option to display week numbers ('year' or 'month').

  * Added: Liquid layout in inline mode.

  * Added: Fullscreen layout in modal mode.

  * Added: Custom width and height for calendar.

Bugfixes
--------

_Core_

  * Fixed: Firefox for Android wheel content overflow (#87).

  * Fixed: Remove html parameter from onBeforeShow event (#111).

  * Fixed: Position mobiscroll on orientation change as well (resize is not always fired on iOS).

_Zepto JS_

  * Fixed: Window width and height calculations (exclude scrollbar).

_jqMobi_

  * Fixed: Window width and height calculations (exclude scrollbar).

_Measurement_

  * Fixed: setValue method can be called with animation.


Changelog 2.5.2
===============

Bugfixes
--------

_Core_

  * Fixed: Could not scroll if scroller was bigger than viewport.


Changelog 2.5.1
===============

Enhancements
------------

_Core_

  * Added: onAnimStart event.

  * Added: onMarkupInserted event.

Bugfixes
--------

_Core_

  * Fixed: Javascript error on cancel with jqm theme (#99).

_Animation_

  * Fixed: In clickpick/mixed mode values were visible above +/- buttons during animation.


Changelog 2.5.0
===============

Enhancements
------------

_Core_

  * Added: onValueTap event.

_Select_

  * Added: Multiple selection functionality (#37).

_Calendar_

  * Added: Multiple day selection functionality.

  * Added: Week selection functionality.

  * Added: onMonthChange event.

Bugfixes
--------

_Core_

  * Fixed: Input value was not parsed if value was set after mobiscroll init (#88).

  * Fixed: Tap or click lock scroller in mixed mode (#89).

  * Fixed: Click on wheel arrows ddid not animate switch (#90).

_Datetime_

  * Fixed: Month showed 0 - 11 on wheel using dateOrder 'mdyy' (#92).

_Calendar_

  * Fixed: During month change animation a day was incorrectly highlighted.

  * Fixed: Month change animation was laggy on iOS5.

_Measurements_

  * Fixed: Fraction values are now correctly disabled for negative values as well.


Changelog 2.4.5
===============

Enhancements
------------

_Core_

  * Changed: validation moved back to touchend instead of animation end.

  * Changed: setValue method now also accepts string or number, not array only (#79).

  * Added: tap option to fire button actions on tap instead of click. Default is true (#83).


Bugfixes
--------

_Core_

  * Fixed: tapping on buttons triggered form element focus underneath on Android.

  * Fixed: moving wheels were not stopped correctly on tap on Android > 4 (stock browser).

  * Fixed: initial value can be set now with setValue without filling the input (#77).

_List Preset_

  * Fixed: Wheel remained locked in some cases (#84).


Changelog 2.4.4
===============

Enhancements
------------

_Core_

  * Changed: Set and cancel events are now fired on tap instead of click (on touchscreen).

_Themes_

  * Added: Windows Phone theme now has an 'accent' option to set the highlight color of the theme. Possible values: 'lime', 'green', 'emerald', 'teal', 'cyan', 'cobalt', 'indigo', 'violet', 'pink', 'magenta', 'crimson', 'red', 'orange', 'amber', 'yellow', 'brown', 'olive', 'steel', 'mauve', 'sienna'.

Bugfixes
--------

_Core_

  * Fixed: theme initialization moved before positioning, as it may affect the width/height of the popup.

_List Preset_

  * Fixed: Don't regenerate the list on every change, only if needed.

  * Fixed: setValue did not set the value correctly on hierarchical wheels.

_Datetime Preset_

  * Fixed: AM/PM wheel respects timeWheels order as well (#54).

_Calendar Preset_

  * Fixed: set option caused stack overflow (#74).


Changelog 2.4.3
===============

Enhancements
------------

_Core_

  * Added: isVisible method (#60)

Bugfixes
--------

_Core_

  * Fixed: Multiple event firing (#45)

_Plugins_

  * Fixed: jqMobi and Zepto error, if loaded multiple times (#72)


Changelog 2.4.2
===============

Enhancements
------------

_Core_

  * Move event is attached only on demand (#71)

Bugfixes
--------

_Core_

  * Positioning fixes

  * Validation bugfix

_Themes_

  * Windows Phone theme: font-size fix in clickpick mode


Changelog 2.4.1
===============

Enhancements
------------

_Themes_

  * Sense UI theme: border removed when positioned top or bottom

  * Android ICS theme: border removed when positioned top or bottom

Bugfixes
--------

_Core_

  * Positioning fixes

  * Firefox animation bug fixed by removing border-radius from the wheel

_Datetime preset_

  * Expose datetime preset settings to the inst.settings property


Changelog 2.4
=============

Enhancements
------------

_Core_

  * Changed: Use div-s instead of ul-s and li-s

  * Changed: Don't scroll the wheels if validate function returns false

  * Added: 'btn' parameter to the onClose event, 'set' or 'cancel' is passed depending on which button triggered the close

_Measurement presets_

  * Added: if step > 1, fraction wheel is not generated

  * Added: fraction wheel is infinite

_Themes_

  * Added: 'jqmBorder' option to the jQueryMobile theme to change the swatch of the border


Bugfixes
--------

_Core_

  * Fixed: Also disable button elements when showing modal popup

_Rating preset_

  * Fixed: parseValue returned incorrect value

  * Fixed: value was incorrectly set if elements were generated from a select element

_Themes_

  * Fixed: onCancel event was not fired if scroller was hidden by clicking on the overlay (#58)


Changelog 2.3.1
===============

Enhancements
------------

_Core_

  * Added: time parameter to the changeWheel method, which means the animation time to scroll the new wheel to the selected value

Bugfixes
--------

_Core_

  * Fixed: missing ":" in core css (#46)

  * Fixed: Don't allow to move another wheel until touchend occurs on the currently scrolled wheel

Changelog 2.3
=============

Enhancements
------------

_Core_

  * Changed: prevent collisions if core is loaded multiple times

  * Changed: validate and onChange event runs on scrolling animation end providing a more fluid user experience (#36)

  * Changed: user defined event handlers does not override preset event handlers

  * Added: onShow gets an additional valueText parameter

  * Added: onAnimStart event, which is fired at scrolling animation start, and receives the wheel index, animation time, and the mobiscroll instance as parameters

  * Added: shorthand form for presets: $('.selector').mobiscroll().date(). To add a shorthand for your own preset, just add the following line in your preset code: $.mobiscroll.presetShort('mypresetname')

  * Added: highlight selected entry on tap

_Select preset_

  * Changed: make it work with late validation

_List preset_

  * Changed: make it work with late validation

_Themes_

  * Changed: prevent collisions if themes are loaded multiple times

Bugfixes
--------

_Core_

  * Fixed: don't do tap ahead, if moving wheel was stopped with a tap

  * Fixed: setValue method was not working correctly (#43)

  * Fixed: if close was canceled (onClose returned false), the value was still set

_Datetime preset_

  * Fixed: closing tag for the short day name and short month name span was incorrectly added

_Select preset_

  * Fixed: onChange, onSelect, onCancel events received the disabled value, if the user scrolled to a disabled option, event though on the UI was not selectable (#40)

_Rating preset_

  * Fixed: stars were not aligned to middle in Firefox and IE

Changelog 2.2
=============

Enhancements
------------

_Core_

  * Added: move the wheel to the selected value on tap

  * Added: selected values now have a 'dw-sel' css class

  * Added: support for Windows Phone 8

_Datetime preset_

  * Added: month and day names are wrapped in &lt;span class="dw-mon"&gt; and &lt;span class="dw-day"&gt; to allow more styling

_List preset_

  * Added: a new preset which transforms ul/ol html lists into a scroller

_Animation plugin_

  * Added: Internet Explorer 10 support

_Themes_

  * Added: Windows Phone theme

Bugfixes
--------

_Core_

  * Fixed: onClose received null as valueText parameter

  * Fixed: button flickering during animation on Chrome

  * Fixed: options were not correctly updated 'on the fly' (by using the 'option' method on an existing instance) - Issue 112 on Google Code

  * Fixed: wheel could not be stopped on the correct place if another wheel was scrolled before the animation finished

  * Fixed: +/- buttons didn't reappear in mixed mode, if a wheel was changed (e.g. with group select preset)

_Datetime preset_

  * Fixed: If input had no value, default date/datetime was the time when the control was initialized, not when it was shown

_Select preset_

  * Fixed: setValue did not set correctly the second wheel, if optgroup was not the original

Changelog 2.1
=============

Enhancements
------------

_Core_

  * Changed: changeWheel function can change more than one wheel at once

_Select preset_

  * Added: 'rtl' (right to left) option, when set to true the groups wheel appears on the right


Bugfixes
--------

_Core_

  * Fixed: input change is triggered after the modal scroller is hidden (form controls are re-enabled)

  * Fixed: added a dw- prefix for animation css classes to prevent naming collision with other libraries

  * Fixed: the width calculation in positioning skips the width of hidden wheels

_Datetime preset_

  * Fixed: Day names on wheels fixed (if long name contained 'D', both short and long names appeared)

_Themes_

  * Fixed: android-ics skin arrows moves the wheel in correct direction

Changelog 2.1-beta
==================

Enhancements
------------

_Core_

  * Added: new display properties, which controls where the scroller is positioned: 'modal', 'bubble', 'top', 'bottom'

  * Added: 'anchor' property to specify the anchor element for positioning, if 'display' is set to 'bubble'

  * Added: 'animate' property to specify predefined animations in 'modal' and 'bubble' modes, during the show/hide of the scroller: 'fade', 'flip', 'pop', 'swing', 'slidevertical', 'slidehorizontal', 'slidedown', 'slideup'

  * Added: 'scrollLock' setting to disable page scrolling in modal/bubble/docked display modes. Default is 'true'

  * Added: 'changeWheel' public method, which takes the wheelindex as argument, and regenerates that wheel based on the wheel object

  * Changed:'readonly' setting now takes an array too, with the boolean values for each wheel

_Select preset_

  * Added: 'group' and 'groupLabel' options to render two wheels based on optgroups

_Datetime preset_

  * Added: 'showNow' and 'nowText' options, which renders an additional 'Now' button (if display is not inline)

_Themes_

  * Changed: iOS theme is updated

Bugfixes
--------

_Core_

  * Fixed: In 'mixed' mode, if wheel was scrolled and stopped with a tap, +/- buttons remained hidden


Changelog 2.0.3
===============

Enhancements
------------

_Core_

  * Added: Support for language files. Controlled from 'lang' option. Specify language related default settings and language files.

Bugfixes
--------

_Core_

  * Fixed: 'clickpick' mode worked the same way as 'mixed' in 2.0.2

  * Fixed: 'setValue' was not working correctly.

  * Fixed: Wheels were misaligned on Firefox with ios theme and datetime preset.

_Datetime preset_

  * Fixed: Time was incorrectly parsed when missing year, month or day wheel.

  * Fixed: Default year value was not set, if outside of startYear and endYear.


Changelog 2.0.2
===============

Enhancements
------------

_Core_

  * Added: animation time is now passed to the validation event (useful, if you want an action to happen only when the wheel stops moving)

  * Added: wheel containers have now numbered classes: 'dwwl0', 'dwwl1', 'dwwl2' etc. to allow different styling for each wheel

_Select preset_

  * Added: 'invalid' option to set certain values unselectable. This option takes precedence over the disabled options in the original html select element.

  * Added: 'label' option to set the label of the wheel. If not present, the label is taken from the original html select element's label, and falls back to the select element's name attribute, if the label doesn't exist

Bugfixes
--------

_Datetime preset_

  * Fixed: 'shortYearCutoff' option was not working correctly. (With '+10' value if 2 digits years were used, 12 was converted to 1912 instead of 2012)

  * Fixed: if day was not present on the wheels (e.g. credit card expration), the date object defaulted to today's date, which resulted in incorrect value, if current month had more days as the selected month

  * Fixed: day names were incorrect, if initial validation changed the month from an invalid value to the nearest valid one

_Select preset_

  * Fixed: 'setValue' and 'getValue' methods overwrote the core methods and were unusable for other presets or custom scrollers

_Zepto js plugin_

  * Fixed: in 'mixed' mode clicking on the +/- buttons caused a short button blink

_jQuery Mobile Theme_

  * Fixed: Button appearance with JQM 1.1.1

Changelog 2.0.1
===============

Bugfixes
--------

  * Fixed: HTML5 min/max attributes propagated to other scrollers

  * Fixed: jQuery Mobile 1.0 compatibility (Issue 95)

  * Fixed: Using values like "1.0", "2.0", etc. on custom wheels caused incorrect behavior because they were converted to numbers and became 1, 2, etc.

  * Fixed: fast scrolling caused value loss, if validation changed another wheel value with animation

  * Fixed: when element was created for 3d testing: document.createElement(mod) - mod was undefined

  * Fixed: setValue and getValue was not working correctly with the select preset

  * Fixed: timeWheels option did not modify the order of the wheels

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
