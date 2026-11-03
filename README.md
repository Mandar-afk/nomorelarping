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
- [ ] Phase 6 — Testing and Final Polish
