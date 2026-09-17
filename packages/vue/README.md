# @mobiscroll/vue-lite

Open-source Vue form, notification and popup components from Mobiscroll — the scheduling,
event calendar and resource management UI library. Apache-2.0.

Scheduling screens are mostly forms: the dialog that creates an event, the filters above a
timeline, the confirmation when something moves. These are those components, built for the rest
of Mobiscroll and published on their own.

| Group                                                                       | Components                                                                            |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Forms](https://demo.mobiscroll.com/vue/forms)                              | Button, Checkbox, Dropdown, Input, Radio button, Segmented, Stepper, Switch, Textarea |
| [Notifications](https://demo.mobiscroll.com/vue/forms/alert-confirm-prompt) | Alert, Confirm, Prompt, Snackbar, Toast                                               |
| [Popup](https://demo.mobiscroll.com/vue/popup)                              | Modal dialog, anchored popover, bottom sheet, inline                                  |

The popup handles focus trapping, the ARIA dialog role and keyboard dismissal, so anything built
on it behaves the way assistive technology expects. Same design system and theming as the rest
of Mobiscroll — a form built with these sits next to a Mobiscroll scheduler without looking
bolted on. TypeScript types and both ESM and CommonJS builds are in the package.

## Install

```bash
npm install @mobiscroll/vue-lite
```

Public npm — no CLI, no registry configuration, no licence key.

## Usage

```vue
<script setup>
import { ref } from 'vue';
import { MbscInput, MbscButton, MbscToast } from '@mobiscroll/vue-lite';
import '@mobiscroll/vue-lite/dist/css/mobiscroll.min.css';

const showToast = ref(false);
</script>

<template>
  <MbscInput label="Email" type="email" />
  <MbscButton @click="showToast = true">Save</MbscButton>
  <MbscToast :is-open="showToast" message="Saved" @close="showToast = false" />
</template>
```

## The rest of Mobiscroll UI

This package ships only the components above. The event calendar, scheduler, timeline and date
pickers are commercial and distributed separately:

| Group                 | Components                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event calendar system | [Event Calendar](https://demo.mobiscroll.com/vue/eventcalendar), [Scheduler](https://demo.mobiscroll.com/vue/scheduler), [Timeline](https://demo.mobiscroll.com/vue/timeline), [Agenda](https://demo.mobiscroll.com/vue/agenda) |
| Date and time         | [Calendar](https://demo.mobiscroll.com/vue/calendar), [Date & Time](https://demo.mobiscroll.com/vue/datetime), [Range](https://demo.mobiscroll.com/vue/range)                                                                   |
| Supporting            | [Select](https://demo.mobiscroll.com/vue/select)                                                                                                                                                                                |

They need a trial or a licence and install through the Mobiscroll CLI:
https://mobiscroll.com/docs/vue/getting-started/installation

## Links

- Documentation — https://mobiscroll.com/docs/vue
- Demos — https://demo.mobiscroll.com/vue
- Mobiscroll scheduling UI — https://mobiscroll.com/scheduling-ui
- Releases and changelog — https://mobiscroll.com/releases
- Issues — https://github.com/acidb/mobiscroll/issues
- Licensed support — https://mobiscroll.com/support
- Licence — https://github.com/acidb/mobiscroll/blob/master/LICENSE
