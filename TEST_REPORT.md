# Verification report — 21 October 2026

## Passed

- React production build.
- Node.js 22 backend regression suite: 41 checks, using isolated local disk state.
- Hosted-mode persistence regression suite: 43 checks using a deterministic
  asynchronous Redis mock. Includes concurrent registrations/team saves,
  restart recovery, lost-write-lease handling and database outage rejection.
- Chromium browser checks: admin login, fixture rescheduling, selecting all 11
  players through the UI, unsaved state before submission, draft surviving the
  periodic refresh, explicit save, saved lineup after reload, manual locking,
  real-statistics entry, logout and admin controls hidden from anonymous users.
- Mobile layout at 390 × 844: no horizontal document overflow.
- No browser JavaScript page errors in the exercised flows.
- npm audit: zero known vulnerabilities reported for both dependency sets
  after upgrading the styling build dependency and removing unused packages.

The regression suites also cover malformed input, duplicate ID rejection,
pre-lock privacy, avatar payload validation, accurate partial-over economy,
shared ranks, result corrections, no-result matches, all six fixtures, admin
password recovery, revoked sessions, squad editing locks and rate limiting.

## Not verified against external services

- No deployment was made to the user's Vercel account.
- No real Upstash credentials/database were available for a hosted end-to-end test.
- Redis Lua scripts were exercised through a mock, not a real Redis server.
- No high-volume load test was performed. Whole-state JSON storage is designed
  for a small family tournament; it is not a high-scale commercial database model.

Run the LIVE deployment checklist in DEPLOYMENT_GUIDE.md before real play.

## Deliberate scope

- Manual real-scorecard entry, not an automatic cricket data feed.
- Custom ODI scoring, not a claim of ICC endorsement or regulatory equivalence.
- Full-length ODI NRR; reduced-overs/DLS matches are not supported.
- No email ownership verification or automatic email-based password recovery.
  Recovery is administered after identity confirmation.
- Sample squads and dates must be verified and configured by the administrator.
- Corrections that would change finalists after final lineups/statistics exist
  are blocked rather than silently invalidating participants' saved teams.
