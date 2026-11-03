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
- **Planned storage**: IndexedDB via Dexie.js 3 (local-first, v1)
- **PWA**: Planned for Phase 5

The repository interfaces and Dexie schema form the foundation for the local-first data layer. Persistence, repositories, hooks, and the interface are added in later phases.

## Phase Completion Log

- [x] Phase 1 — Project Foundation
- [ ] Phase 2 — UI and Design
- [ ] Phase 3 — Core Functionality
- [ ] Phase 4 — Persistence
- [ ] Phase 5 — PWA and Deployment
- [ ] Phase 6 — Testing and Final Polish
