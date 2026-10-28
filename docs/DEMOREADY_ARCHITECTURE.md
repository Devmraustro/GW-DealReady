# Portugal / DealReady demo boundary

## What runs where

- `/`, `/homes`, `/homes/[slug]`, `/saved`, `/compare`, `/dealready`, `/plans`, and `/workspace/*` are the Portugal-first synthetic experience. The data and pure readiness/filter/validation logic live in `lib/portugal/`; React state is persisted only to this browser's `localStorage` under `gw-dealready.demo.v1`. A different browser does not receive those changes. It is not a server-side database, account, backup, or access-control boundary. Anyone using the same browser profile can view or alter the demo state. Never enter real personal data.
- `/algeria`, `/properties`, `/cars`, `/map`, `/services`, `/about`, `/contact`, `/admin/*` and `/api/*` retain the upstream application. The copied Pro foundation has one server-authenticated administrator, Neon/PostgreSQL JSONB records, input validation, same-origin mutation checks and a database-backed audit for its original collections. Its `proxy.ts` and API authorization remain in place. No database or admin credentials are supplied to this demo project. The demo's explicit `NEXT_PUBLIC_CATALOG_MODE=demo` only enables the old synthetic public catalogue; it must not be used as a live commercial catalogue.
- There is **no** multi-user login, tenant isolation, record ownership enforcement, agency roles, or server entitlement implementation for the new DealReady experience. The free/Pro switch and locked states are browser-only product simulations. They do not authorize any server operation or create subscriptions.
- The original Pro database schema does not yet have the Portugal deal, document, lifecycle or plan entities. The local `DemoDeal` and `MarketProperty` types are a UI/domain boundary, not a migration or production API. Integrating a real backend requires tenant-scoped schemas and authenticated server-side ownership/role/entitlement checks on every read and write, migrations, transactions, rate limits, CSRF handling, and independent security review.

## Readiness and documents

Every deal's score is `round(completed / total * 100)` across equally weighted visible rules: a minimally complete profile, a property and date, each required document accepted by a human, and all displayed discrepancies marked reviewed (or none present). Uploaded, requested or rejected documents do not count as accepted. This is operational completeness, not identity verification, fraud detection or legal advice.

A selected demo file is validated in the browser for PDF/JPEG/PNG and 1 byte–5 MB. **No file bytes are read, uploaded, or retained**; only a truncated filename and simulated status are stored locally. This is not server-side file validation. Synthetic comparison values and a source/page label are seeded explicitly; no OCR provider is called and no confidence score is manufactured. Review actions record local timestamps and a simulated actor. They do not overwrite profile values.

A real implementation needs private tenant-scoped object storage, MIME/magic-byte validation, malware scanning, short-lived authorized access, encryption and retention/deletion policy; an OCR adapter returning provider-supplied provenance/confidence; explicit reviewer identity and immutable server audit; and cross-tenant/IDOR tests. Do not add a public bucket for sensitive documents.

## Rental lifecycle, plans and communications

Dates, contract state, check-in/out, deposit recording, renewal and maintenance controls are synthetic local workflow markers; there is no legal classification, contract generation, accounting, payment, reminder delivery, email, SMS or external verification. Portuguese contracts and classification require review by a qualified Portuguese legal professional. Proposed plan packaging is not a commercial commitment.

All Portugal listing photography is AI-generated illustration; listings, locations, prices, people and analytics are synthetic. Some fixture names and proper nouns are intentionally unchanged between languages. PT/EN/FR/AR UI strings are supplied in one dictionary; Arabic sets `dir=rtl`.

## Verification and rollout gates

`npm test`, `npm run typecheck`, `npm run lint`, `npm run build` and `npm run test:e2e` are the intended local checks. The browser test assumes a running server at `http://127.0.0.1:3000`, or set `E2E_BASE_URL`; install Playwright's Chromium (`npx playwright install chromium`) or set `CHROMIUM_PATH`. It tests the demo flow and the original admin endpoint's unauthenticated rejection; it cannot prove cross-user server authorization because that feature does not exist. Live database, authorized admin, ownership and provider integration tests need isolated infrastructure and were not run against production.

Do not promote this demonstration to a commercial deployment. Provision separate non-production database and private storage, design a multi-tenant identity model, implement server authorization/entitlements and provider adapters, complete legal/privacy review, and test those boundaries before handling real data.
