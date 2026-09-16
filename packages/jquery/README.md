# @mobiscroll/jquery-lite

Open-source jQuery form, notification and popup components from Mobiscroll — the scheduling,
event calendar and resource management UI library. Apache-2.0.

| Group         | Components                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Forms         | Button, Checkbox, Dropdown, Input, Radio button, Segmented, Stepper, Switch, Textarea                                                 |
| Notifications | Alert, Confirm, Prompt, Snackbar, Toast                                                                                               |
| Popup         | Modal dialog, anchored popover, bottom sheet and inline display modes, with a focus trap, the ARIA dialog role and keyboard dismissal |

Same design system, theming and accessibility work as the rest of Mobiscroll — a form built
with these sits next to a Mobiscroll scheduler without looking bolted on.

## Install

```bash
npm install @mobiscroll/jquery-lite
```

Public npm — no CLI, no registry configuration, no licence key.

## Usage

```html
<label>
  Email
  <input mbsc-input id="email" />
</label>
<button mbsc-button id="save">Save</button>
```

```js
import '@mobiscroll/jquery-lite/dist/css/mobiscroll.min.css';

$('#save').on('click', function () {
  mobiscroll.toast({ message: 'Saved' });
});
```

## Free vs. commercial

This package only ships the components above. The rest of Mobiscroll UI is commercial and
distributed separately:

| Group                 | Components                                  |
| --------------------- | -------------------------------------------- |
| Event calendar system | Event Calendar, Scheduler, Timeline, Agenda |
| Date and time         | Calendar, Date & Time, Range                |
| Supporting            | Select                                      |

They need a trial or a licence and install through the Mobiscroll CLI:
https://mobiscroll.com/docs/jquery/getting-started/installation

## Links

- Documentation — https://mobiscroll.com/docs/jquery
- Demos — https://demo.mobiscroll.com/jquery
- Product — https://mobiscroll.com/scheduling-ui
- Issues — https://github.com/acidb/mobiscroll/issues
- Licensed support — https://mobiscroll.com/support
- Licence — [Apache-2.0](../../LICENSE)
