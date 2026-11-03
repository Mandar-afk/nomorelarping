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

## Architecture

- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS 3
- **Storage foundation**: Dexie.js 3 schema and repository interfaces are in place; data is currently in memory
- **PWA**: vite-plugin-pwa configured; icon assets and install verification are planned for Phase 5

Sections are managed through `AppContext`, and task behavior is handled by `useTasks`; both use in-memory state in this phase. Phase 4 will connect the repository interfaces to IndexedDB persistence.

## Phase Completion Log

- [x] Phase 1 — Project Foundation
- [x] Phase 2 — UI and Design
- [x] Phase 3 — Core Functionality
- [ ] Phase 4 — Persistence
- [ ] Phase 5 — PWA and Deployment
- [ ] Phase 6 — Testing and Final Polish
