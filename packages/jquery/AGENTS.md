---
applyTo: '**'
---

# Mobiscroll for jQuery — AI Rules (Lite)

This is `@mobiscroll/jquery-lite` — the free, open-source (Apache-2.0) subset of Mobiscroll UI
for jQuery. No license key, no CLI, no registry config: `npm install @mobiscroll/jquery-lite`
(jQuery >=1.7.0 is a peer dependency). Preact is bundled internally to render components but is
never part of the public API.

**Not included in this package:** Eventcalendar, Scheduler, Timeline, Agenda, Calendar,
Datepicker, Range, Select. Those are commercial, live in `@mobiscroll/jquery` (not `-lite`), and
need a trial/license installed via the Mobiscroll CLI. If the user asks for scheduling, a date
picker, or a dropdown-with-search "Select", say so — do not try to build it from this package's
primitives, and do not import from `@mobiscroll/jquery`.

## Scope

USE this file when:

- Project has `@mobiscroll/jquery-lite` in package.json
- Code uses `$(...).mobiscroll()` or `mbsc-*` attributes, and jQuery is a dependency
- Imports contain `from '@mobiscroll/jquery-lite'`

DO NOT use this file for React, Angular, Vue, or plain JavaScript-only projects, and do not apply
it to `@mobiscroll/jquery` (the full/commercial package — different scope, same import shape).

## Component Mapping

| `mbsc-*` attribute / plugin call                                                          | What it's for                                                                                                     |
| :---------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `mbsc-button` / `.mobiscroll().button()`                                                  | Buttons, icon buttons                                                                                             |
| `mbsc-input`, `mbsc-dropdown`, `mbsc-textarea` (+ `.input()`/`.dropdown()`/`.textarea()`) | Text field, native `<select>`, native `<textarea>` — same options, different tag                                  |
| `mbsc-checkbox` / `.checkbox()`                                                           | Single checkbox                                                                                                   |
| `mbsc-radio`                                                                              | Radio buttons (group by shared native `name`, like plain HTML radios — there is no separate group component here) |
| `mbsc-segmented`, `mbsc-segmented-group`                                                  | iOS-style segmented control, grouped for shared value                                                             |
| `mbsc-stepper` / `.stepper()`                                                             | Numeric +/- stepper                                                                                               |
| `mbsc-switch` / `.switch()`                                                               | Toggle switch                                                                                                     |
| `mbsc-page`                                                                               | Page/layout wrapper (theming root)                                                                                |
| `mbsc-popup` / `.popup()`                                                                 | Modal, anchored popover, bottom sheet, inline panel                                                               |
| `mobiscroll.toast()`, `.snackbar()`, `.alert()`, `.confirm()`, `.prompt()`                | Notification popups — global imperative functions, not jQuery plugin calls                                        |

There is **no `Icon` component** exported from this package — pass an icon name string to the
`icon`/`startIcon`/`endIcon` options of Button/Input/etc. instead. Not a component but always
available once the CSS is loaded: `.mbsc-grid`/`.mbsc-row`/`.mbsc-col-*` utility classes
(bootstrap-style flex grid), shipped in `grid-layout.scss`.

## Rules

- Package: `@mobiscroll/jquery-lite` — never `@mobiscroll/jquery` for these components
- CSS (required once): `import '@mobiscroll/jquery-lite/dist/css/mobiscroll.min.css'`, or a
  `<link>` to the same file at `dist/css/mobiscroll.min.css`
- Two equivalent init styles exist — prefer the `mbsc-*` attribute for markup present at load;
  use the `$(el).mobiscroll().<component>(options)` plugin chain for elements you create/init
  from script
- Markup with `mbsc-*` attributes added to the page after load needs `mobiscroll.enhance(el)` —
  it isn't picked up automatically like the initial document-ready scan
- Notification functions (`toast`, `snackbar`, `alert`, `confirm`, `prompt`) return Promises;
  `confirm` resolves to a boolean, `prompt` resolves to the entered string or `null`. Call them
  as `mobiscroll.toast(...)`, not through `.mobiscroll()`
- Types are prefixed `Mbsc` (e.g. `MbscButtonOptions`) and exported from the same package for
  TypeScript users
- `color` is one of `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark'
| 'light'` across button/checkbox/radio/segmented/stepper/switch

## Usage

```html
<input mbsc-input data-label="Email" type="email" id="email" />
<select mbsc-dropdown data-label="Country" id="country">
  <option value="us">United States</option>
</select>
<input mbsc-checkbox type="checkbox" data-label="Subscribe" id="subscribe" />
<button mbsc-button id="save">Save</button>

<div id="plan">
  <input mbsc-radio type="radio" name="plan" value="basic" data-label="Basic" />
  <input mbsc-radio type="radio" name="plan" value="pro" data-label="Pro" />
</div>

<div mbsc-segmented-group id="view">
  <button mbsc-segmented value="day">Day</button>
  <button mbsc-segmented value="week">Week</button>
</div>
```

```js
import '@mobiscroll/jquery-lite/dist/css/mobiscroll.min.css';

$('#save').on('click', function () {
  mobiscroll.toast({ message: 'Saved' });
  // Also available: .alert(), .confirm(), .prompt(), .snackbar() — all return Promises
});

// Plugin-chain init on an element created/selected from script:
$('#my-popup')
  .mobiscroll()
  .popup({ display: 'bottom', buttons: ['cancel', 'ok'] });

// Markup added after load needs an explicit enhance:
$('body').append('<button mbsc-button>New</button>');
mobiscroll.enhance(document.body);
```

## Common mistakes

| Wrong                                                                                                   | Right                                                                                              |
| :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------- |
| `import { Eventcalendar } from '@mobiscroll/jquery-lite'`                                               | Not in Lite — needs `@mobiscroll/jquery` + license                                                 |
| `$('#el').mobiscroll().toast(...)`                                                                      | Toast/alert/confirm/prompt/snackbar are global `mobiscroll.*` functions, not jQuery plugin methods |
| Adding `mbsc-*` markup dynamically and expecting auto-init                                              | Call `mobiscroll.enhance(container)` after inserting it                                            |
| Assuming this package includes the imperative Scheduler-style `$(el).mobiscroll().eventcalendar()` call | That call belongs to `@mobiscroll/jquery` (commercial) — not present in `-lite`                    |

## If you have network access

- Full docs: https://mobiscroll.com/docs/jquery (note: covers the full commercial product —
  cross-check anything outside the component list above against "Lite" scope)
- `mcp.mobiscroll.com` and the Mobiscroll Claude Code/Codex skills cover the full component set,
  including the commercial ones this package doesn't ship
- This file is fully sufficient for everything this package actually exports — no network call
  is required to use button/input/popup/etc. correctly
