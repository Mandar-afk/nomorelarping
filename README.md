# NOMORELARPING

Personal task management. No more larping.

## Local Development

### Prerequisites
- Node.js 20+
- npm 9+

### Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173.

### Build

```bash
npm run build
npm run preview
```

## Storage and Backups

Sections and tasks are stored locally in IndexedDB through Dexie. Data stays in
the current browser profile and is not synced between devices. Use **Export** in
the sidebar to download a JSON backup, or **Import** to replace the current data
with a validated backup.

## Installable app

Build and serve the production app over localhost:

```bash
npm run build
npm run preview
```

Open the preview URL in a supported browser and use its install control to add
NOMORELARPING to the device. The service worker caches the application shell for
offline loading. Tasks and sections remain available offline in that browser.

## Deployment

The repository includes Vercel settings for Vite. Deploy from the project root
with the Vercel CLI after linking the project:

```bash
vercel --prod
```

## Architecture

- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS 3
- **Storage**: Dexie.js 3 repositories persist sections and tasks in IndexedDB
- **PWA**: vite-plugin-pwa generates the web manifest and service worker; PNG icons are in `public/icons/`

Sections are managed through `AppContext`, and task behavior is handled by
`useTasks`; both use the Dexie repositories for persistence.

## Phase Completion Log

- [x] Phase 1 — Project Foundation
- [x] Phase 2 — UI and Design
- [x] Phase 3 — Core Functionality
- [x] Phase 4 — Persistence
- [x] Phase 5 — PWA and Deployment
- [x] Phase 6 — Testing and Final Polish

## Phase 6 Verification

The interactive checks were run in isolated Chrome profiles against the app
and its production preview.

| Test | Result | Verification |
|---|---|---|
| A1 Create section | Pass | Saved in IndexedDB, selected in the sidebar, and shown in the TopBar. |
| A2 Blank section validation | Pass | Empty and whitespace names show an error and are not saved. |
| A3 Inline rename | Pass | Enter updates the sidebar, TopBar, and IndexedDB. |
| A4 Cancel rename | Pass | Escape keeps the original name. |
| A5 Cascading section delete | Pass | Confirmation appears; confirming removes the section and its task. |
| A6 Refresh persistence | Pass | Active section and tasks reload; task order remains saved. |
| B1 Minimal task | Pass | Default priority is medium, order starts at zero, and due date is absent. |
| B2 Full task | Pass | High badge and Tomorrow date render with the supplied fields. |
| B3 Overdue notice | Pass | Past due date shows red text and the Overdue label. |
| B4 Edit task | Pass | Name, description, and priority update in IndexedDB and the UI. |
| B5 Complete task | Pass | Task moves into the dimmed completed list with strikethrough. |
| B6 Restore task | Pass | Task returns to the active list at the bottom. |
| B7 Drag reorder | Pass | Pointer drag reorders tasks; the order remains after reload. |
| B8 Prevent accidental drag | Pass | Task controls respond to clicks; a sub-five-pixel pointer movement does not start a drag. |
| C1 Export JSON | Pass | Downloaded backup parses and contains version 1, sections, and tasks. |
| C2 Import backup | Pass | Import restores data after a task is deleted. |
| C3 Reject invalid backup | Pass | Invalid payload is rejected and existing records remain intact. |
| D1 Production build | Pass | TypeScript and Vite build succeed; manifest and service worker are generated. |
| D2 Service worker | Pass | Chrome registers and activates the worker for the app origin. |
| D3 Installability | Pass | Chrome reports no installability errors; manifest uses standalone display and valid icons. |
| D4 Offline mode | Pass | The cached app opens offline; tasks can be created and edited in IndexedDB. |

The accessibility review confirmed keyboard navigation through dialogs, focus
wrapping at both ends, Escape to close, and focus returning to the invoking
control. Interactive controls have visible or programmatic names, and form
fields have labels. `npx tsc --noEmit` passes; `src/` contains no `any`,
`console.log`, or `TODO` matches.
