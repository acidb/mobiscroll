---
applyTo: '**'
---

# Mobiscroll for Angular — AI Rules (Lite)

This is `@mobiscroll/angular-lite` — the free, open-source (Apache-2.0) subset of Mobiscroll UI
for Angular. No license key, no CLI, no registry config: `npm install @mobiscroll/angular-lite`.
Requires Angular >=13 (peer dependency); standalone `imports: [MbscModule]` needs Angular 14+.

**Not included in this package:** Eventcalendar, Scheduler, Timeline, Agenda, Calendar,
Datepicker, Range, Select. Those are commercial, live in `@mobiscroll/angular` (not `-lite`), and
need a trial/license installed via the Mobiscroll CLI. If the user asks for scheduling, a date
picker, or a dropdown-with-search "Select", say so — do not try to build it from this package's
primitives, and do not import from `@mobiscroll/angular`.

## Scope

USE this file when:

- Project has `@mobiscroll/angular-lite` in package.json
- Templates use `mbsc-` element selectors, or `MbscModule` is imported
- Imports contain `from '@mobiscroll/angular-lite'`

DO NOT use this file for React, Vue, JavaScript, or jQuery projects, and do not apply it to
`@mobiscroll/angular` (the full/commercial package — different scope, same import shape).

## Component Mapping

| Selector / class                                                        | What it's for                                                                   |
| :---------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| `<mbsc-button>`                                                         | Buttons, icon buttons                                                           |
| `<mbsc-input>`, `<mbsc-dropdown>`, `<mbsc-textarea>`                    | Text field, native `<select>`, native `<textarea>` — same inputs, different tag |
| `<mbsc-checkbox>`                                                       | Single checkbox                                                                 |
| `<mbsc-radio>`, `<mbsc-radio-group>`                                    | Radio buttons, grouped for shared name/value                                    |
| `<mbsc-segmented>`, `<mbsc-segmented-group>`                            | iOS-style segmented control, grouped for shared value                           |
| `<mbsc-stepper>`                                                        | Numeric +/- stepper                                                             |
| `<mbsc-switch>`                                                         | Toggle switch                                                                   |
| `<mbsc-page>`                                                           | Page/layout wrapper (theming root)                                              |
| `<mbsc-popup>`                                                          | Modal, anchored popover, bottom sheet, inline panel                             |
| `<mbsc-icon>`                                                           | Renders an icon by name or inline svg                                           |
| `Notifications` service (`toast`/`snackbar`/`alert`/`confirm`/`prompt`) | Notification popups, injected — not template selectors                          |

Not a component but always available once the stylesheet is loaded: `.mbsc-grid`/`.mbsc-row`/
`.mbsc-col-*` utility classes (bootstrap-style flex grid), shipped in `grid-layout.scss`.

## Rules

- Package: `@mobiscroll/angular-lite` — never `@mobiscroll/angular` for these components
- Import `MbscModule` once — into a standalone component's `imports` array (Angular 14+) or an
  `NgModule`'s `imports` array. Do not add it to both.
- CSS: add `node_modules/@mobiscroll/angular-lite/dist/css/mobiscroll.min.css` to `angular.json`
  `styles` array — do NOT `import` it from a `.ts` file
- To use `Notifications.toast()`/`.alert()`/etc., inject `Notifications` from
  `@mobiscroll/angular-lite` in the constructor — it's a provided service, not a component
- Value components (`mbsc-checkbox`, `mbsc-radio`, `mbsc-switch`, `mbsc-input`, `mbsc-stepper`,
  `mbsc-segmented`) implement `ControlValueAccessor` — `[(ngModel)]` and reactive forms
  (`formControlName`) both work
- Types are prefixed `Mbsc` (e.g. `MbscButtonOptions`, `MbscPopupOptions`) and exported from the
  same package
- All components accept `cssClass`, `theme`, `themeVariant`, `rtl`, `responsive` in addition to
  what's listed below
- `color` is one of `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark'
| 'light'` across button/checkbox/radio/segmented/stepper/switch

## Usage

```ts
import { Component } from '@angular/core';
import { MbscModule, Notifications } from '@mobiscroll/angular-lite';

@Component({
  selector: 'contact-form',
  standalone: true,
  imports: [MbscModule],
  template: `
    <mbsc-input label="Email" type="email" [(ngModel)]="email"></mbsc-input>
    <mbsc-dropdown label="Country" [(ngModel)]="country">
      <option value="us">United States</option>
    </mbsc-dropdown>
    <mbsc-checkbox label="Subscribe" [(ngModel)]="subscribed"></mbsc-checkbox>
    <mbsc-button color="primary" (click)="save()">Save</mbsc-button>

    <mbsc-radio-group name="plan" [(ngModel)]="plan">
      <mbsc-radio value="basic" label="Basic"></mbsc-radio>
      <mbsc-radio value="pro" label="Pro"></mbsc-radio>
    </mbsc-radio-group>

    <mbsc-segmented-group [(ngModel)]="view">
      <mbsc-segmented value="day">Day</mbsc-segmented>
      <mbsc-segmented value="week">Week</mbsc-segmented>
    </mbsc-segmented-group>

    <mbsc-stepper label="Guests" [min]="1" [max]="10" [(ngModel)]="guests"></mbsc-stepper>
    <mbsc-switch label="Notifications" [(ngModel)]="notify"></mbsc-switch>

    <mbsc-popup [isOpen]="isOpen" display="bottom" [buttons]="['cancel', 'ok']" (close)="isOpen = false">
      <p>Popup content</p>
    </mbsc-popup>

    <mbsc-icon name="home"></mbsc-icon>
  `,
})
export class ContactForm {
  email = '';
  country = 'us';
  subscribed = false;
  plan = 'basic';
  view = 'day';
  guests = 1;
  notify = false;
  isOpen = false;

  constructor(private notifications: Notifications) {}

  save() {
    this.notifications.toast({ message: 'Saved' });
    // Also available: .alert(), .confirm(), .prompt(), .snackbar() — all return Promises
  }
}
```

## Common mistakes

| Wrong                                                                           | Right                                                 |
| :------------------------------------------------------------------------------ | :---------------------------------------------------- |
| `import { MbscEventcalendar } from '@mobiscroll/angular-lite'`                  | Not in Lite — needs `@mobiscroll/angular` + license   |
| `import '@mobiscroll/angular-lite/dist/css/mobiscroll.min.css'` in a `.ts` file | Add it to `angular.json` → `styles` instead           |
| Importing `MbscModule` in both a standalone component and an `NgModule`         | Pick one place only                                   |
| Calling `toast()` as a free function                                            | It's a method on the injected `Notifications` service |

## If you have network access

- Full docs: https://mobiscroll.com/docs/angular (note: covers the full commercial product —
  cross-check anything outside the component list above against "Lite" scope)
- `mcp.mobiscroll.com` and the Mobiscroll Claude Code/Codex skills cover the full component set,
  including the commercial ones this package doesn't ship
- This file is fully sufficient for everything this package actually exports — no network call
  is required to use mbsc-button/mbsc-input/mbsc-popup/etc. correctly
