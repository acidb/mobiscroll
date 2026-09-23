---
applyTo: '**'
---

# Mobiscroll for Vue — AI Rules (Lite)

This is `@mobiscroll/vue-lite` — the free, open-source (Apache-2.0) subset of Mobiscroll UI for
Vue 3. No license key, no CLI, no registry config: `npm install @mobiscroll/vue-lite`.

**Not included in this package:** Eventcalendar, Scheduler, Timeline, Agenda, Calendar,
Datepicker, Range, Select. Those are commercial, live in `@mobiscroll/vue` (not `-lite`), and
need a trial/license installed via the Mobiscroll CLI. If the user asks for scheduling, a date
picker, or a dropdown-with-search "Select", say so — do not try to build it from this package's
primitives, and do not import from `@mobiscroll/vue`.

## Scope

USE this file when:

- Project has `@mobiscroll/vue-lite` in package.json
- Files use `.vue` and template Mobiscroll form/popup/notification components
- Imports contain `from '@mobiscroll/vue-lite'`

DO NOT use this file for React, Angular, JavaScript, or jQuery projects, and do not apply it to
`@mobiscroll/vue` (the full/commercial package — different scope, same import shape).

## Component Mapping

| Component(s)                                                          | What it's for                                                                  |
| :-------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| `MbscButton`                                                          | Buttons, icon buttons                                                          |
| `MbscInput`, `MbscDropdown`, `MbscTextarea`                           | Text field, native `<select>`, native `<textarea>` — same props, different tag |
| `MbscCheckbox`                                                        | Single checkbox                                                                |
| `MbscRadio`, `MbscRadioGroup`                                         | Radio buttons, grouped for shared name/value                                   |
| `MbscSegmented`, `MbscSegmentedGroup`                                 | iOS-style segmented control, grouped for shared value                          |
| `MbscStepper`                                                         | Numeric +/- stepper                                                            |
| `MbscSwitch`                                                          | Toggle switch                                                                  |
| `MbscPage`                                                            | Page/layout wrapper (theming root)                                             |
| `MbscPopup`                                                           | Modal, anchored popover, bottom sheet, inline panel                            |
| `MbscIcon`                                                            | Renders an icon by name or inline svg                                          |
| `MbscAlert`, `MbscConfirm`, `MbscPrompt`, `MbscSnackbar`, `MbscToast` | Notification popups, controlled via `is-open`                                  |

Not a component but always available once the CSS is imported: `.mbsc-grid`/`.mbsc-row`/
`.mbsc-col-*` utility classes (bootstrap-style flex grid), shipped in `grid-layout.scss`.

## Rules

- Package: `@mobiscroll/vue-lite` — never `@mobiscroll/vue` for these components
- CSS (required once, app root): `import '@mobiscroll/vue-lite/dist/css/mobiscroll.min.css'`
- These are real Vue 3 components (reactivity, `v-model`, `defineComponent`) — not wrappers
  around a plain JS widget. Use `<script setup>` per the package's own README example
- Every value-carrying component supports `v-model` (backed by `modelValue`/`update:modelValue`)
  — prefer `v-model` over manual `:value` + `@update:model-value`
- Types are prefixed `Mbsc` (e.g. `MbscButtonOptions`, `MbscPopupOptions`) and exported from the
  same package
- All components accept `cssClass`, `theme`, `themeVariant`, `rtl`, `responsive` in addition to
  what's listed below
- `color` is one of `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark'
| 'light'` across Button/Checkbox/Radio/Segmented/Stepper/Switch
- Notifications are controlled components: render them once, toggle `is-open`, handle `@close` to
  flip it back — they are not imperative function calls in this package

## Usage

```vue
<script setup>
import { ref } from 'vue';
import { MbscInput, MbscDropdown, MbscCheckbox, MbscButton } from '@mobiscroll/vue-lite';

const email = ref('');
const country = ref('us');
const subscribed = ref(false);
</script>

<template>
  <MbscInput label="Email" type="email" v-model="email" />
  <MbscDropdown label="Country" v-model="country">
    <option value="us">United States</option>
  </MbscDropdown>
  <MbscCheckbox label="Subscribe" v-model="subscribed" />
  <MbscButton color="primary" @click="save">Save</MbscButton>
</template>
```

```vue
<script setup>
import { ref } from 'vue';
import { MbscRadioGroup, MbscRadio, MbscSegmentedGroup, MbscSegmented, MbscStepper, MbscSwitch } from '@mobiscroll/vue-lite';

const plan = ref('basic');
const view = ref('day');
</script>

<template>
  <MbscRadioGroup name="plan" v-model="plan">
    <MbscRadio value="basic" label="Basic" />
    <MbscRadio value="pro" label="Pro" />
  </MbscRadioGroup>

  <MbscSegmentedGroup v-model="view">
    <MbscSegmented value="day">Day</MbscSegmented>
    <MbscSegmented value="week">Week</MbscSegmented>
  </MbscSegmentedGroup>

  <MbscStepper label="Guests" :min="1" :max="10" v-model="guests" />
  <MbscSwitch label="Notifications" v-model="notify" />
</template>
```

```vue
<script setup>
import { ref } from 'vue';
import { MbscPopup, MbscToast, MbscIcon } from '@mobiscroll/vue-lite';

const showToast = ref(false);
const isOpen = ref(false);
</script>

<template>
  <MbscPopup :is-open="isOpen" display="bottom" :buttons="['cancel', 'ok']" @close="isOpen = false">
    <p>Popup content</p>
  </MbscPopup>
  <MbscToast :is-open="showToast" message="Saved" @close="showToast = false" />
  <MbscIcon name="home" />
</template>
```

`MbscAlert`, `MbscConfirm`, `MbscPrompt`, `MbscSnackbar` follow the same `is-open`/`@close` shape
as `MbscToast`, with their own extra props (`title`, `ok-text`/`cancel-text`, `label`/
`placeholder` for Prompt, `button` for Snackbar).

## Common mistakes

| Wrong                                                      | Right                                                                                                                      |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `import { MbscEventcalendar } from '@mobiscroll/vue-lite'` | Not in Lite — needs `@mobiscroll/vue` + license                                                                            |
| `toast({ message: 'Saved' })`                              | `<MbscToast :is-open="open" message="Saved" @close="..." />` — Lite Vue notifications are components, not global functions |
| React-style `checked`/`onChange` props                     | Vue-style `v-model` + `@update:model-value`/`@change`                                                                      |
| Forgetting `@close` on Popup/Toast/etc.                    | Without it, `is-open` never flips back and the component won't close on esc/overlay/button                                 |

## If you have network access

- Full docs: https://mobiscroll.com/docs/vue (note: covers the full commercial product —
  cross-check anything outside the component list above against "Lite" scope)
- `mcp.mobiscroll.com` and the Mobiscroll Claude Code/Codex skills cover the full component set,
  including the commercial ones this package doesn't ship
- This file is fully sufficient for everything this package actually exports — no network call
  is required to use MbscButton/MbscInput/MbscPopup/etc. correctly
