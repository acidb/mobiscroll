# @mobiscroll/react-lite

Open-source React form, notification and popup components from Mobiscroll — the scheduling,
event calendar and resource management UI library. Apache-2.0.

Scheduling screens are mostly forms: the dialog that creates an event, the filters above a
timeline, the confirmation when something moves. These are those components, built for the rest
of Mobiscroll and published on their own.

| Group                                                                         | Components                                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Forms](https://demo.mobiscroll.com/react/forms)                              | Button, Checkbox, Dropdown, Input, Radio button, Segmented, Stepper, Switch, Textarea |
| [Notifications](https://demo.mobiscroll.com/react/forms/alert-confirm-prompt) | Alert, Confirm, Prompt, Snackbar, Toast                                               |
| [Popup](https://demo.mobiscroll.com/react/popup)                              | Modal dialog, anchored popover, bottom sheet, inline                                  |

The popup handles focus trapping, the ARIA dialog role and keyboard dismissal, so anything built
on it behaves the way assistive technology expects. Same design system and theming as the rest
of Mobiscroll — a form built with these sits next to a Mobiscroll scheduler without looking
bolted on. TypeScript types and both ESM and CommonJS builds are in the package.

These are native React components, built on React's own rendering and hooks — not wrappers
around a plain JavaScript widget. State, props and events all work the way they do in any other
React component.

## Install

```bash
npm install @mobiscroll/react-lite
```

Public npm — no CLI, no registry configuration, no licence key.

## Usage

```jsx
import { useState } from 'react';
import { Input, Button, Toast } from '@mobiscroll/react-lite';
import '@mobiscroll/react-lite/dist/css/mobiscroll.min.css';

export default function ContactForm() {
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      <Input label="Email" type="email" />
      <Button onClick={() => setShowToast(true)}>Save</Button>
      <Toast isOpen={showToast} message="Saved" onClose={() => setShowToast(false)} />
    </>
  );
}
```

## The rest of Mobiscroll UI

This package ships only the components above. The event calendar, scheduler, timeline and date
pickers are commercial and distributed separately:

| Group                 | Components                                                                                                                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event calendar system | [Event Calendar](https://demo.mobiscroll.com/react/eventcalendar), [Scheduler](https://demo.mobiscroll.com/react/scheduler), [Timeline](https://demo.mobiscroll.com/react/timeline), [Agenda](https://demo.mobiscroll.com/react/agenda) |
| Date and time         | [Calendar](https://demo.mobiscroll.com/react/calendar), [Date & Time](https://demo.mobiscroll.com/react/datetime), [Range](https://demo.mobiscroll.com/react/range)                                                                     |
| Supporting            | [Select](https://demo.mobiscroll.com/react/select)                                                                                                                                                                                      |

They need a trial or a licence and install through the Mobiscroll CLI:
https://mobiscroll.com/docs/react/getting-started/installation

## Links

- Documentation — https://mobiscroll.com/docs/react
- Demos — https://demo.mobiscroll.com/react
- Mobiscroll scheduling UI — https://mobiscroll.com/scheduling-ui
- Releases and changelog — https://mobiscroll.com/releases
- Issues — https://github.com/acidb/mobiscroll/issues
- Licensed support — https://mobiscroll.com/support
- Licence — https://github.com/acidb/mobiscroll/blob/master/LICENSE
