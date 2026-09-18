---
applyTo: '**'
---

# Mobiscroll for JavaScript — AI Rules (Lite)

This is `@mobiscroll/javascript-lite` — the free, open-source (Apache-2.0) subset of Mobiscroll
UI for plain/vanilla JavaScript. No framework required, no license key, no CLI:
`npm install @mobiscroll/javascript-lite`. Preact is bundled internally to render components but
is never part of the public API — components are used through plain DOM attributes.

**Not included in this package:** Eventcalendar, Scheduler, Timeline, Agenda, Calendar,
Datepicker, Range, Select. Those are commercial, live in `@mobiscroll/javascript` (not `-lite`),
and need a trial/license installed via the Mobiscroll CLI. If the user asks for scheduling, a
date picker, or a dropdown-with-search "Select", say so — do not try to build it from this
package's primitives, and do not import from `@mobiscroll/javascript`.

## Scope

USE this file when:

- Project has `@mobiscroll/javascript-lite` in package.json
- Code imports `from '@mobiscroll/javascript-lite'` or uses the global `mobiscroll` object
- No framework (React/Angular/Vue/jQuery) is in play

DO NOT use this file for React, Angular, Vue, or jQuery projects, and do not apply it to
`@mobiscroll/javascript` (the full/commercial package — different scope, same import shape).

## Component Mapping

| `mbsc-*` attribute                                                         | What it's for                                                                                                     |
| :------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `mbsc-button`                                                              | Buttons, icon buttons                                                                                             |
| `mbsc-input`, `mbsc-dropdown`, `mbsc-textarea`                             | Text field, native `<select>`, native `<textarea>` — same options, different tag                                  |
| `mbsc-checkbox`                                                            | Single checkbox                                                                                                   |
| `mbsc-radio`                                                               | Radio buttons (group by shared native `name`, like plain HTML radios — there is no separate group component here) |
| `mbsc-segmented`, `mbsc-segmented-group`                                   | iOS-style segmented control, grouped for shared value                                                             |
| `mbsc-stepper`                                                             | Numeric +/- stepper                                                                                               |
| `mbsc-switch`                                                              | Toggle switch                                                                                                     |
| `mbsc-page`                                                                | Page/layout wrapper (theming root)                                                                                |
| `mbsc-popup` (also `mobiscroll.popup(el, options)`)                        | Modal, anchored popover, bottom sheet, inline panel                                                               |
| `mobiscroll.toast()`, `.snackbar()`, `.alert()`, `.confirm()`, `.prompt()` | Notification popups — imperative functions, no markup needed                                                      |

There is **no `Icon` component** exported from this package (icons are internal rendering
details used by Button/Input, etc. — pass an icon name string to those options instead). Not a
component but always available once the CSS is loaded: `.mbsc-grid`/`.mbsc-row`/`.mbsc-col-*`
utility classes (bootstrap-style flex grid), shipped in `grid-layout.scss`.

## Rules

- Package: `@mobiscroll/javascript-lite` — never `@mobiscroll/javascript` for these components
- CSS (required once): `import '@mobiscroll/javascript-lite/dist/css/mobiscroll.min.css'`, or a
  `<link>` to the same file at `dist/css/mobiscroll.min.css`
- Components initialise from the `mbsc-*` attribute in markup present at load — there is no
  per-element setup call needed for those
- For markup inserted into the DOM after initial load, call `mobiscroll.enhance(element)` to
  activate any `mbsc-*` attributes inside it
- Notification functions (`toast`, `snackbar`, `alert`, `confirm`, `prompt`) return Promises;
  `confirm` resolves to a boolean, `prompt` resolves to the entered string or `null`
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

<input mbsc-stepper data-label="Guests" data-min="1" data-max="10" id="guests" />
<input mbsc-switch type="checkbox" data-label="Notifications" id="notify" />
```

```js
import '@mobiscroll/javascript-lite/dist/css/mobiscroll.min.css';

document.getElementById('save').addEventListener('click', function () {
  mobiscroll.toast({ message: 'Saved' });
  // Also available: .alert(), .confirm(), .prompt(), .snackbar() — all return Promises
});

// Inline/modal popup created imperatively:
mobiscroll.popup('#my-popup', { display: 'bottom', buttons: ['cancel', 'ok'] });

// Markup added after load needs an explicit enhance:
document.body.insertAdjacentHTML('beforeend', '<button mbsc-button>New</button>');
mobiscroll.enhance(document.body);
```

## Common mistakes

| Wrong                                                         | Right                                                                                          |
| :------------------------------------------------------------ | :--------------------------------------------------------------------------------------------- |
| `import { Eventcalendar } from '@mobiscroll/javascript-lite'` | Not in Lite — needs `@mobiscroll/javascript` + license                                         |
| `import { Icon } from '@mobiscroll/javascript-lite'`          | No Icon export here — pass an icon name to `icon`/`startIcon`/`endIcon` options instead        |
| Adding `mbsc-*` markup dynamically and expecting auto-init    | Call `mobiscroll.enhance(container)` after inserting it                                        |
| `React`/jQuery-style event binding assumptions                | Plain `addEventListener`; components read `data-*` attributes or JS options objects, not props |

## If you have network access

- Full docs: https://mobiscroll.com/docs/javascript (note: covers the full commercial product —
  cross-check anything outside the component list above against "Lite" scope)
- `mcp.mobiscroll.com` and the Mobiscroll Claude Code/Codex skills cover the full component set,
  including the commercial ones this package doesn't ship
- This file is fully sufficient for everything this package actually exports — no network call
  is required to use button/input/popup/etc. correctly
