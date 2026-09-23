# @mobiscroll/angular-lite

Open-source Angular form, notification and popup components from Mobiscroll — the scheduling,
event calendar and resource management UI library. Apache-2.0.

Scheduling screens are mostly forms: the dialog that creates an event, the filters above a
timeline, the confirmation when something moves. These are those components, built for the rest
of Mobiscroll and published on their own.

| Group                                                                           | Components                                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Forms](https://demo.mobiscroll.com/angular/forms)                              | Button, Checkbox, Dropdown, Input, Radio button, Segmented, Stepper, Switch, Textarea |
| [Notifications](https://demo.mobiscroll.com/angular/forms/alert-confirm-prompt) | Alert, Confirm, Prompt, Snackbar, Toast                                               |
| [Popup](https://demo.mobiscroll.com/angular/popup)                              | Modal dialog, anchored popover, bottom sheet, inline                                  |

The popup handles focus trapping, the ARIA dialog role and keyboard dismissal, so anything built
on it behaves the way assistive technology expects. Same design system and theming as the rest
of Mobiscroll — a form built with these sits next to a Mobiscroll scheduler without looking
bolted on. TypeScript types and both ESM and CommonJS builds are in the package.

These are native Angular components, built on Angular's own template rendering and change
detection — not wrappers around a plain JavaScript widget. `@Input`/`@Output` bindings, forms
integration and dependency injection all work the way they do in any other Angular component.

## Install

```bash
npm install @mobiscroll/angular-lite
```

Public npm — no CLI, no registry configuration, no licence key.

## Usage

```ts
import { Component } from '@angular/core';
import { MbscModule, Notifications } from '@mobiscroll/angular-lite';

@Component({
  selector: 'contact-form',
  standalone: true,
  imports: [MbscModule],
  template: `
    <mbsc-input label="Email" type="email"></mbsc-input>
    <mbsc-button (click)="save()">Save</mbsc-button>
  `,
})
export class ContactForm {
  constructor(private notify: Notifications) {}

  save() {
    this.notify.toast({ message: 'Saved' });
  }
}
```

Load the stylesheet once, in `angular.json`:

```json
"styles": [
  "src/styles.css",
  "node_modules/@mobiscroll/angular-lite/dist/css/mobiscroll.min.css"
]
```

The standalone component above needs Angular 14 or later. On Angular 13, declare `MbscModule`
in an `NgModule` instead.

## The rest of Mobiscroll UI

This package ships only the components above. The event calendar, scheduler, timeline and date
pickers are commercial and distributed separately:

| Group                 | Components                                                                                                                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event calendar system | [Event Calendar](https://demo.mobiscroll.com/angular/eventcalendar), [Scheduler](https://demo.mobiscroll.com/angular/scheduler), [Timeline](https://demo.mobiscroll.com/angular/timeline), [Agenda](https://demo.mobiscroll.com/angular/agenda) |
| Date and time         | [Calendar](https://demo.mobiscroll.com/angular/calendar), [Date & Time](https://demo.mobiscroll.com/angular/datetime), [Range](https://demo.mobiscroll.com/angular/range)                                                                       |
| Supporting            | [Select](https://demo.mobiscroll.com/angular/select)                                                                                                                                                                                            |

They need a trial or a licence and install through the Mobiscroll CLI:
https://mobiscroll.com/docs/angular/getting-started/installation

## Links

- Documentation — https://mobiscroll.com/docs/angular
- Demos — https://demo.mobiscroll.com/angular
- Mobiscroll scheduling UI — https://mobiscroll.com/scheduling-ui
- Releases and changelog — https://mobiscroll.com/releases
- Issues — https://github.com/acidb/mobiscroll/issues
- Licensed support — https://mobiscroll.com/support
- Licence — https://github.com/acidb/mobiscroll/blob/master/LICENSE
