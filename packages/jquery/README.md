# @mobiscroll/jquery-lite

Open-source jQuery form, notification and popup components from Mobiscroll — the scheduling,
event calendar and resource management UI library. Apache-2.0.

Scheduling screens are mostly forms: the dialog that creates an event, the filters above a
timeline, the confirmation when something moves. These are those components, built for the rest
of Mobiscroll and published on their own.

| Group                                                                          | Components                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [Forms](https://demo.mobiscroll.com/jquery/forms)                              | Button, Checkbox, Dropdown, Input, Radio button, Segmented, Stepper, Switch, Textarea |
| [Notifications](https://demo.mobiscroll.com/jquery/forms/alert-confirm-prompt) | Alert, Confirm, Prompt, Snackbar, Toast                                               |
| [Popup](https://demo.mobiscroll.com/jquery/popup)                              | Modal dialog, anchored popover, bottom sheet, inline                                  |

The popup handles focus trapping, the ARIA dialog role and keyboard dismissal, so anything built
on it behaves the way assistive technology expects. Same design system and theming as the rest
of Mobiscroll — a form built with these sits next to a Mobiscroll scheduler without looking
bolted on. TypeScript types and both ESM and CommonJS builds are in the package.

The Preact library is bundled inside and handles rendering internally — it's an implementation
detail, never exposed in the public API, so components are used through the `mbsc-` attribute
and jQuery's own plugin conventions as shown below.

## Install

```bash
npm install @mobiscroll/jquery-lite
```

Public npm — no CLI, no registry configuration, no licence key.

## Usage

Components initialise from the `mbsc-` attribute — there is no plugin call per element.

```html
<input mbsc-input data-label="Email" type="email" id="email" /> <button mbsc-button id="save">Save</button>
```

```js
import '@mobiscroll/jquery-lite/dist/css/mobiscroll.min.css';

$('#save').on('click', function () {
  mobiscroll.toast({ message: 'Saved' });
});
```

The stylesheet is loaded through a bundler here; the package also ships it at
`dist/css/mobiscroll.min.css` if you would rather use a `<link>` tag. For markup added to the
page after load, call `mobiscroll.enhance(element)`.

## The rest of Mobiscroll UI

This package ships only the components above. The event calendar, scheduler, timeline and date
pickers are commercial and distributed separately:

| Group                 | Components                                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event calendar system | [Event Calendar](https://demo.mobiscroll.com/jquery/eventcalendar), [Scheduler](https://demo.mobiscroll.com/jquery/scheduler), [Timeline](https://demo.mobiscroll.com/jquery/timeline), [Agenda](https://demo.mobiscroll.com/jquery/agenda) |
| Date and time         | [Calendar](https://demo.mobiscroll.com/jquery/calendar), [Date & Time](https://demo.mobiscroll.com/jquery/datetime), [Range](https://demo.mobiscroll.com/jquery/range)                                                                      |
| Supporting            | [Select](https://demo.mobiscroll.com/jquery/select)                                                                                                                                                                                         |

They need a trial or a licence and install through the Mobiscroll CLI:
https://mobiscroll.com/docs/jquery/getting-started/installation

## Links

- Documentation — https://mobiscroll.com/docs/jquery
- Demos — https://demo.mobiscroll.com/jquery
- Mobiscroll scheduling UI — https://mobiscroll.com/scheduling-ui
- Releases and changelog — https://mobiscroll.com/releases
- Issues — https://github.com/acidb/mobiscroll/issues
- Licensed support — https://mobiscroll.com/support
- Licence — https://github.com/acidb/mobiscroll/blob/master/LICENSE
