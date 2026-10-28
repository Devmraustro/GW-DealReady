# Integration audit and execution checklist

## Baseline (2026-10-28)

- Session checkout: `Devmraustro/GW-DealReady`, branch `arena/5819297d-gw-dealready`, starting commit `0b2067cba5b0786c0e88b23c7389a9057d82a2c0`, clean; only a one-line README existed.
- Requested source: `Devmraustro/GW-IMMOBILIER`. Default `main` at `6e3342425bb2f5fae98cdab99475b7ac589bd80e`; `pro/phase-1-foundation` at `c1d29cae7a1d04c8f9c3f664522224be77d625ea`, 165 commits ahead of main. The latter was copied as the integration baseline; no upstream branches were changed.
- Main: Next.js 15, TypeScript, Tailwind, FR/AR, Algerian demo property and car catalogue, maps and browser-local admin. No server/database/authentication in main. Baseline `npm ci`, `npm test -- --run` (102 tests), `npm run lint`, `npx tsc --noEmit`, `npm run build`: passed.
- Pro branch: Next.js 16, React 19, TypeScript, Tailwind, Radix, Neon PostgreSQL adapter/migration, a single server-authenticated administrator and protected CRUD/inquiry/catalog endpoints. Database operations are fail-closed. No multi-user roles, ownership isolation, subscription/entitlement model, OCR, document storage, payments, or email provider were found. Baseline `npm ci`, `npm test` (130 tests), `npm run lint` (58 existing warnings, no errors), `npm run typecheck`, and `npm run build`: passed. No database credentials were copied or used.
- Existing Vercel `gw-immobilier` project and domains exist; project is paused. A separate `gw-immobilier-qa` project is protected. Neither is modified or used for this demo.

## Component research

- `aelassas/movinin`: active, MIT, TypeScript; a complete multi-service MongoDB application rather than a drop-in Next component. Not imported.
- `clawnify/OpenProperty`: active, MIT, React/Vite + Hono/SQLite, not a compatible drop-in component. Not imported.
- `microrealestate/microrealestate`: active, but current Sustainable Use License restricts commercial/hosted use. Not imported.
- `orpms/orpms`: archived, GPL-2.0 and older jQuery/Express architecture. Not imported.
- Existing Radix, Lucide, Next and domain utilities are reused. No third-party source was copied from these candidates.

## Execution checklist

- [x] Preserve the Pro baseline, Algerian routes, migration, API and authentication code in this separate repository.
- [x] Use an independent Portugal demo data model rather than connect production database or credentials.
- [x] Add Portugal discovery, details, favorites/comparison and inquiry-to-deal journey.
- [x] Add browser-local DealReady review/readiness/audit and rental lifecycle demo with explicit limitations.
- [x] Add Portuguese, English, French and Arabic navigation and responsive UI.
- [x] Add plan comparison and accurately labeled local simulation (no payment or server entitlement claims).
- [x] Test and build; test principal flows and authorization boundaries.
- [ ] Create an isolated Vercel project and verify the deployment if hosting permissions permit.

The public demo is intentionally synthetic and is not a secure, persistent commercial workspace. Do not enter real customer data or documents.

## Demo verification notes

The inherited Next.js 16.4.0 dependency was updated to 16.4.3 after the current npm audit flagged critical advisories; `npm audit fix` also updated a vulnerable development transitive dependency. The current full `npm audit --audit-level=moderate` reported zero vulnerabilities. Local production build and the browser smoke suite passed; the browser test is explicitly not a multi-user authorization test. See `docs/DEMOREADY_ARCHITECTURE.md` for integration and security gaps.
