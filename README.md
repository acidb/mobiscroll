# Mobiscroll

Scheduling, event calendar and resource management UI components, and Mobiscroll Connect,
the calendar connectivity layer for scheduling products.

[![npm](https://img.shields.io/npm/v/@mobiscroll/react-lite)](https://www.npmjs.com/package/@mobiscroll/react-lite)
[![downloads](https://img.shields.io/npm/dm/@mobiscroll/react-lite)](https://www.npmjs.com/package/@mobiscroll/react-lite)
[![license](https://img.shields.io/github/license/acidb/mobiscroll)](LICENSE)

Two products, used independently or together, for teams building scheduling, booking,
planning and resource-management systems — rota and shift planning, field service, crew
management, appointment scheduling.

This repository is the index for both, and holds the source of the open-source Mobiscroll
form, notification and popup components.

---

## Mobiscroll UI

Scheduler, event calendar, resource timeline and agenda views, plus the calendar, date, time
and range pickers. Ships as plain JavaScript and jQuery builds, and as native React, Angular
and Vue components — not wrappers.

- Product — https://mobiscroll.com/scheduling-ui
- Documentation — https://mobiscroll.com/docs
- Demos — 400+ runnable examples with source, https://demo.mobiscroll.com

### What is in this repository

The **open-source form, notification and popup components**, Apache-2.0, published as the
`@mobiscroll/{framework}-lite` packages on public npm.

| Group         | Components                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Forms         | Button, Checkbox, Dropdown, Input, Radio button, Segmented, Stepper, Switch, Textarea                                                 |
| Notifications | Alert, Confirm, Prompt, Snackbar, Toast                                                                                               |
| Popup         | Modal dialog, anchored popover, bottom sheet and inline display modes, with a focus trap, the ARIA dialog role and keyboard dismissal |

Same design system, theming and accessibility work as the rest of Mobiscroll — a form built
with these sits next to a Mobiscroll scheduler without looking bolted on.

```
npm install @mobiscroll/react-lite        # React
npm install @mobiscroll/angular-lite      # Angular
npm install @mobiscroll/vue-lite          # Vue
npm install @mobiscroll/javascript-lite   # plain JavaScript
npm install @mobiscroll/jquery-lite       # jQuery
```

Public npm — no CLI, no registry configuration, no licence key.

```jsx
import { Input, Button, Popup, toast } from '@mobiscroll/react-lite';
import '@mobiscroll/react-lite/dist/css/mobiscroll.min.css';

export default function ContactForm() {
  return (
    <>
      <Input label="Email" type="email" />
      <Button onClick={() => toast({ message: 'Saved' })}>Save</Button>
    </>
  );
}
```

### What is not in this repository

The scheduling components are commercial and distributed separately:

| Group                 | Components                                  |
| --------------------- | ------------------------------------------- |
| Event calendar system | Event Calendar, Scheduler, Timeline, Agenda |
| Date and time         | Calendar, Date & Time, Range                |
| Supporting            | Select                                      |

They need a trial or a licence and install through the Mobiscroll CLI:
https://mobiscroll.com/docs/react/getting-started/installation

---

## Mobiscroll Connect

One integration for Google Calendar, Microsoft Outlook, Apple Calendar and CalDAV, with a
unified Calendar API, normalized calendar data, OAuth and consent flows, calendar sync and
webhooks. Backend only — it works with your own UI and does not require Mobiscroll UI.

- Product — https://mobiscroll.com/connect
- Documentation — https://mobiscroll.com/docs/connect/overview
- SDKs — https://github.com/acidb/mobiscroll-connect-sdks
  (Node.js, Python, PHP, .NET, Java, Go, Ruby, plus direct REST)
- Runnable example — https://github.com/acidb/mobiscroll-connect-demo

No Connect source lives in this repository. The SDK monorepo above is its home.

---

## Tooling

- **CLI** — installs and configures Mobiscroll in a project,
  https://mobiscroll.com/docs/javascript/core-concepts/cli
- **AI tooling** — MCP server at https://mcp.mobiscroll.com, agent skills for Claude Code and
  Codex, rule files for Cursor and GitHub Copilot.
  https://mobiscroll.com/docs/javascript/guides/ai-integration

## Releases

[CHANGELOG.md](CHANGELOG.md) covers both products in separate sections — Mobiscroll UI on the
v6 line, Mobiscroll Connect on its own, since they version independently. Entries cover the
whole of each product rather than only the components in this repository, and each links to
the full notes rather than restating them:

- Mobiscroll UI — https://mobiscroll.com/releases
- Mobiscroll Connect — https://mobiscroll.com/releases/connect

## Support

Issues with the components in this repository: open an issue here.
Licensed customers: https://mobiscroll.com/support

## Licence

The source in this repository is licensed under the Apache License 2.0 — see [LICENSE](LICENSE).
The commercial Mobiscroll UI components and Mobiscroll Connect are not covered by it and are
distributed under separate commercial terms.
