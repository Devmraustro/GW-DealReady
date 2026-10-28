# GW-DealReady × GW Immobilier

An isolated, synthetic Portugal-first interactive demo, built on the existing GW Immobilier Pro foundation. See [the integration audit](docs/INTEGRATION_AUDIT.md), [the upstream README](docs/UPSTREAM_README.md) and [the Pro foundation notes](docs/PRO_FOUNDATION.md), and [the demo architecture and security boundary](docs/DEMOREADY_ARCHITECTURE.md).

**Shareable demo:** https://gw-dealready-portugal-demo.vercel.app/ (synthetic data only).

**This is not a production workspace.** The new Portugal/DealReady flows use fictional seed data and browser-local state, not the PostgreSQL database. Do not enter real personal information or documents. The demonstration does not upload files, perform OCR, send messages, verify identities or process payments. A human review interaction is simulated locally. The existing `/admin` and `/api/admin/*` remain protected by the upstream single-admin authentication and fail closed without their own configuration; they are not the public demo workspace.

```sh
npm ci
npm run dev -- --hostname 0.0.0.0
npm test
npm run typecheck
npm run lint
npm run build
# With a server running and Playwright Chromium installed:
npm run test:e2e
```

The original Algerian catalogue, car rental, map and services are available through the Algeria link. The Portugal demo is independent of production inventory and database credentials. Plan differences are proposed, client-side simulations only; no server entitlement or real subscription is implied. Legal classification and contracts require qualified local review.
