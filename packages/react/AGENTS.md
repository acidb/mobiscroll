---
applyTo: '**'
---

# Mobiscroll for React — AI Rules (Lite)

This is `@mobiscroll/react-lite` — the free, open-source (Apache-2.0) subset of Mobiscroll UI
for React. No license key, no CLI, no registry config: `npm install @mobiscroll/react-lite`.

**Not included in this package:** Eventcalendar, Scheduler, Timeline, Agenda, Calendar,
Datepicker, Range, Select. Those are commercial, live in `@mobiscroll/react` (not `-lite`), and
need a trial/license installed via the Mobiscroll CLI. If the user asks for scheduling, a date
picker, or a dropdown-with-search "Select", say so — do not try to build it from this package's
primitives, and do not import from `@mobiscroll/react`.

## Scope

USE this file when:

- Project has `@mobiscroll/react-lite` in package.json
- Imports contain `from '@mobiscroll/react-lite'`
- Files use `.tsx`/`.jsx` and render Mobiscroll form/popup/notification components

DO NOT use this file for Angular, Vue, JavaScript, or jQuery projects, and do not apply it to
`@mobiscroll/react` (the full/commercial package — different scope, same import shape).

## Component Mapping

| Component(s)                                      | What it's for                                                                  |
| :------------------------------------------------ | :----------------------------------------------------------------------------- |
| `Button`                                          | Buttons, icon buttons                                                          |
| `Input`, `Dropdown`, `Textarea`                   | Text field, native `<select>`, native `<textarea>` — same props, different tag |
| `Checkbox`                                        | Single checkbox                                                                |
| `Radio`, `RadioGroup`                             | Radio buttons, grouped for shared name/value                                   |
| `Segmented`, `SegmentedGroup`                     | iOS-style segmented control, grouped for shared value                          |
| `Stepper`                                         | Numeric +/- stepper                                                            |
| `Switch`                                          | Toggle switch                                                                  |
| `Page`                                            | Page/layout wrapper (theming root)                                             |
| `Popup`                                           | Modal, anchored popover, bottom sheet, inline panel                            |
| `Icon`                                            | Renders an icon by name or inline svg                                          |
| `Alert`, `Confirm`, `Prompt`, `Snackbar`, `Toast` | Notification popups, controlled via `isOpen`                                   |

Not a JS component but always available once the CSS is imported: `.mbsc-grid`/`.mbsc-row`/
`.mbsc-col-*` utility classes (bootstrap-style flex grid), shipped in `grid-layout.scss`.

## Rules

- Package: `@mobiscroll/react-lite` — never `@mobiscroll/react` for these components
- CSS (required once, app root): `import '@mobiscroll/react-lite/dist/css/mobiscroll.min.css'`
- These are real React components (hooks, state, props) — not wrappers around a JS widget
- Types are prefixed `Mbsc` (e.g. `MbscButtonOptions`, `MbscPopupOptions`) and exported from the
  same package
- All components accept `cssClass`, `theme`, `themeVariant`, `rtl`, `responsive` (breakpoint
  overrides) in addition to what's listed below
- `color` is one of `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark'
| 'light'` across Button/Checkbox/Radio/Segmented/Stepper/Switch
- Notifications are controlled components: render them once, toggle `isOpen`, handle `onClose`
  to flip it back — they are not imperative function calls in this package

## Usage

```jsx
import { Button, Input, Dropdown, Textarea, Checkbox } from '@mobiscroll/react-lite';

<Button color="primary" variant="outline" onClick={handleSave}>Save</Button>

<Input label="Email" type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
<Dropdown label="Country" value={country} onChange={(ev) => setCountry(ev.target.value)}>
  <option value="us">United States</option>
</Dropdown>
<Textarea label="Notes" value={notes} onChange={(ev) => setNotes(ev.target.value)} />

<Checkbox label="Subscribe" checked={subscribed} onChange={(ev) => setSubscribed(ev.target.checked)} />
```

```jsx
import { Radio, RadioGroup, Segmented, SegmentedGroup, Stepper, Switch } from '@mobiscroll/react-lite';

<RadioGroup name="plan" value={plan} onChange={(ev) => setPlan(ev.target.value)}>
  <Radio value="basic" label="Basic" />
  <Radio value="pro" label="Pro" />
</RadioGroup>

<SegmentedGroup value={view} onChange={(ev) => setView(ev.target.value)}>
  <Segmented value="day">Day</Segmented>
  <Segmented value="week">Week</Segmented>
</SegmentedGroup>

<Stepper label="Guests" min={1} max={10} value={guests} onChange={(ev) => setGuests(ev.target.value)} />
<Switch label="Notifications" checked={notify} onChange={(ev) => setNotify(ev.target.checked)} />
```

```jsx
import { Popup, Toast, Icon } from '@mobiscroll/react-lite';

<Popup isOpen={isOpen} display="bottom" buttons={['cancel', 'ok']} onClose={() => setIsOpen(false)}>
  <p>Popup content</p>
</Popup>

<Toast isOpen={showToast} message="Saved" duration={3000} onClose={() => setShowToast(false)} />

<Icon name="home" />
```

`Alert`, `Confirm`, `Prompt`, `Snackbar` follow the same `isOpen`/`onClose` shape as `Toast`, with
their own extra props (`title`, `okText`/`cancelText`, `label`/`placeholder` for `Prompt`, `button`
for `Snackbar`).

## Common mistakes

| Wrong                                                           | Right                                                                                                            |
| :-------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `import { Eventcalendar } from '@mobiscroll/react-lite'`        | Not in Lite — needs `@mobiscroll/react` + license                                                                |
| `toast({ message: 'Saved' })` (imperative call)                 | `<Toast isOpen={open} message="Saved" onClose={...} />` — Lite React notifications are components, not functions |
| `import '@mobiscroll/react-lite/dist/css/mobiscroll.react.css'` | The published file is `dist/css/mobiscroll.min.css`                                                              |
| Forgetting `onClose` on `Popup`/`Toast`/etc.                    | Without it, `isOpen` never flips back to `false` and the component won't close on esc/overlay/button             |
| Using Angular/Vue prop names (`[disabled]`, `v-model`)          | Plain JSX props: `disabled`, `value`+`onChange`                                                                  |

## If you have network access

- Full docs: https://mobiscroll.com/docs/react (note: covers the full commercial product —
  cross-check anything outside the component list above against "Lite" scope)
- `mcp.mobiscroll.com` and the Mobiscroll Claude Code/Codex skills cover the full component set,
  including the commercial ones this package doesn't ship
- This file is fully sufficient for everything this package actually exports — no network call
  is required to use Button/Input/Popup/etc. correctly
