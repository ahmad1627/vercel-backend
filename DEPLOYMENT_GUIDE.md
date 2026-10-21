# Fantasy Cricket — corrected manual-scoring edition

This application uses React/Vite, Node.js/Express, and Upstash Redis on Vercel.
Deploy the ENTIRE project as ONE Vercel project. You do not deploy frontend and
backend separately. No Python or Render service is needed.

## What this edition does

- Sign-up, login, persistent saved lineups, private pre-deadline teams.
- Server-enforced start-time deadlines plus manual admin locking.
- Admin score-entry table; all fantasy teams recalculate from entered statistics.
- Draft statistics updates during a match, final results, and corrections.
- Custom ODI points, captain 2x and vice captain 1.5x; equal scores share ranks.
- Full-length 50-over ODI innings-based NRR; no-result fantasy points are zero.
- Admin account recovery with session revocation.
- National squad editing BEFORE teams or statistics are saved.
- Auto-refresh of fixture status and leaderboards every 15 seconds.

This is a small private family tournament app. It is not affiliated with ICC,
IPL or any commercial fantasy operator. No live-score subscription is included.
Points change when the administrator saves statistics, not automatically after
every ball. Reduced-overs/DLS results need separate rules and are not supported.
Email/password accounts are supported; email ownership verification and social
login are not offered. The interface does not claim emails are verified.

## 1. Extract and upload the project

1. Extract the corrected ZIP on your computer.
2. Open the extracted project folder. It must contain `package.json`,
   `vercel.json`, `api`, `backend`, `frontend`, and this guide together.
3. Create a private GitHub repository and upload those extracted files/folders.
   Do not upload just the ZIP. Do not upload `.env`, `node_modules`,
   `frontend/dist` or `backend/data`.
4. Commit the files. For an existing project, replace the old source files and
   remove the old `backend/src/cricapiService.js` simulation file.

## 2. Create or import the Vercel project

1. Sign in at https://vercel.com/ and select Add New > Project.
2. Import your GitHub repository.
3. Root Directory: the folder containing the ROOT `package.json` and
   `vercel.json`. Do NOT select `frontend` as the project root.
4. Framework Preset: Other. Node.js Version: 22.x.
5. The included `vercel.json` sets:
   - Install: `npm ci && npm --prefix frontend ci`
   - Build: `npm --prefix frontend run build`
   - Output Directory: `frontend/dist`
6. Use your personal Hobby plan for this private project if eligible. Check the
   dashboard’s current terms and usage limits; free hosting is not unlimited.

## 3. Connect Upstash Redis

1. In your Vercel project, open Storage / Marketplace and choose Upstash Redis.
2. Create a database on the Free plan and connect it to this project.
3. Alternatively, create an account-owned Free database directly at
   https://console.upstash.com/ and copy its REST connection details into Vercel.
4. The app specifically needs these TWO environment variable names:
   - `UPSTASH_REDIS_REST_URL` — the HTTPS REST URL, NOT a `redis://` URL.
   - `UPSTASH_REDIS_REST_TOKEN` — the full read/write REST token, NOT read-only.
5. If the integration created differently named variables, add the exact names
   above using the same REST values. Never use a `VITE_` prefix for secrets.

You do not upload a database file to Vercel. The first successful API request
initializes the tournament in Redis. Subsequent deployments reuse that state.

## 4. Add the administrator and signing secret

Open Vercel Project > Settings > Environment Variables. Add:

| Name | Value |
| --- | --- |
| JWT_SECRET | A private random value, at least 32 characters |
| ADMIN_EMAIL | Your own administrator email |
| ADMIN_PASSWORD | A strong private password, at least 10 characters |
| UPSTASH_REDIS_REST_URL | Your database’s REST URL |
| UPSTASH_REDIS_REST_TOKEN | Your database’s read/write REST token |

To generate JWT_SECRET on your own PC with Node installed:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Keep these values in your dashboard/password manager, not in source code,
GitHub, screenshots or chat. Enable variables for Production. If you use
Preview deployments, configure those too; preview and production use separate
state keys by default. Leave `GAME_NAMESPACE` unset unless you intentionally
want a separate tournament. Do not reuse a namespace across unrelated apps.

ADMIN_EMAIL and ADMIN_PASSWORD create the FIRST administrator only. Changing
these variables later does not overwrite an existing account in Redis. Use the
admin Account recovery panel to change a password; keep owner credentials safe.

## 5. Deploy / redeploy

1. Click Deploy, or open Deployments > latest deployment > Redeploy after adding
   the variables.
2. Wait for Ready. Open the deployment URL.
3. Open `https://YOUR-SITE.vercel.app/api/health` in another tab.
   A working database and configuration should return `"status":"healthy"`.
4. If it returns 503 with a missing-variable list, fix those settings and redeploy.
5. Sign in with ADMIN_EMAIL and ADMIN_PASSWORD. You should see
   **Manage matches & scores**. Ordinary users do not see that panel.

## 6. Configure the tournament BEFORE inviting cousins

The supplied fixtures and squads are samples from the original project, not a
verified real-world schedule. The old October dates may already have passed.

1. Open Manage matches & scores.
2. Expand Verify / edit national squads. Correct names and roles, add/remove
   players, and click Save squads. You must do this before any fantasy teams or
   statistics are saved. Existing teams prevent roster edits to preserve fairness.
3. Select each fixture and set its actual future start date/time and venue.
   Times entered/displayed follow your DEVICE timezone (Pakistan users should
   use their normal Pakistan device timezone).
4. Click Save schedule. If a manual lock exists on an unscored fixture, remove
   the manual lock first, then reschedule. Removing a manual lock alone NEVER
   bypasses a past scheduled deadline.
5. Only the active fixture accepts teams. Finalizing it activates the next one.
6. Do not use old simulated scores for a real game. If this database already
   contains test teams/results, back up any wanted records first and use the
   explicitly confirmed Reset tournament action to start a fresh game.
   Reset removes teams and scores; accounts and your edited national squads stay.

## 7. How your cousins play

1. Open the same production URL on their phones/computers.
2. Sign In / Register > Register Team; enter email, a password of at least 10
   characters, name and a unique fantasy team name.
3. Select 11 players with the displayed role limits and at most 7 from one side.
4. Choose Captain and Vice-Captain.
5. Click Save 11-Player Fantasy Lineup and wait for the success message.
   Selecting 11 players alone DOES NOT save a team.
6. Reload once to check the saved team. They can edit and save again only before
   the server deadline/admin lock. Other managers’ teams stay hidden until lock.

## 8. Enter real scores and finalize

1. At match start, the scheduled deadline locks entries automatically. You can
   click Lock now earlier when appropriate.
2. Open Manage matches & scores and choose that fixture.
3. Mark the actual Playing XI; enter runs, balls faced, fours, sixes, bowling,
   wickets, catches, stumpings/direct run-outs, and indirect run-outs.
4. Cricket overs use `5.5` for five overs and five balls, never `5.6`.
5. Leave non-playing players at zero and unticked.
6. Save statistics & update points can be used repeatedly while scoring. All
   saved fantasy teams are recalculated. Other screens refresh within 15 seconds.
7. To finish a win/tie, select exactly 11 playing players from EACH national side.
   Choose the result and winner; enter BOTH national-team innings totals, wickets
   and overs. Finalize / correct result calculates NRR and opens the next fixture.
8. For an abandoned game, choose No result; all fantasy points for that fixture
   are zero and each national team gets one standings point.
9. To correct a completed match, select it, edit statistics/totals, and use
   Finalize / correct result again. Standings are rebuilt, not incremented twice.
   Corrections that change finalists are blocked once final teams/scores exist.
10. If another administrator updated the same scorecard, reload it before editing.
    Equal standings points and NRR are resolved by team code for this custom game.

## 9. Verify the LIVE deployment before real play

Local tests do not replace these checks on your Vercel/Upstash account:

- Register two test players on different devices/incognito windows.
- Save two lineups at the same time; reload both and verify each is retained.
- Confirm a normal player cannot see the admin panel or another pre-lock lineup.
- Sign out/in; confirm the team returns. Redeploy and confirm it still returns.
- Lock the match, try editing as a player, and confirm rejection.
- Enter sample statistics; compare captain/vice-captain totals on both devices.
- Finalize and correct a result; confirm standings do not double-count matches.
- Reset test teams/scores before the actual competition and set correct dates.

## Local use in VS Code (Windows)

Install Node.js 22, extract the ZIP and open the root folder in VS Code. In
Terminal > New Terminal, run these commands one at a time:

```sh
npm ci
npm --prefix frontend ci
npm run setup:local
npm run build:frontend
npm start
```

Setup prints a generated LOCAL administrator login and stores it in `.env`.
Open http://localhost:5000 — both the website and API run there. Do not use the
VS Code Live Server extension for this app. Local game data is stored at
`backend/data/game.json` and survives a restart; it is not copied to Vercel.

For frontend editing, keep `npm start` running and in a second terminal run
`npm run dev:frontend`, then open http://localhost:5173.

Run automated checks with `npm test`. Those checks create isolated temporary
state and do not use your real production database.

## Troubleshooting

- Blank fixtures / 503: check all five server variables and Upstash permissions.
- Login works locally but not online: local and production accounts are separate.
- All fixtures locked: sample dates are old; admin must configure future dates.
- 429 at sign-in: too many attempts from one connection; wait 15 minutes.
- Busy/save error: reload before retrying. Success appears only after storage
  confirms the write; temporary database failures are not reported as successful.
- Forgotten player password: admin > Account recovery, verify their identity and
  set a new password. Existing sessions are revoked. No email reset service is used.
- Admin password forgotten: use a secure database recovery procedure; changing
  the initial seed environment variable is not an account password reset.
- Old branding after redeploy: confirm you uploaded the corrected source, built
  from the repository root, and opened the latest production URL.
- Free usage: monitor both provider dashboards. Auto-refresh and snapshot reads
  consume commands/bandwidth; this design targets a small family group.

## Official setup references

- Vercel Node.js functions: https://vercel.com/docs/functions/runtimes/node-js
- Vercel storage marketplace: https://vercel.com/docs/marketplace-storage
- Upstash Vercel integration: https://upstash.com/docs/redis/howto/vercelintegration
- Upstash REST variables: https://upstash.com/docs/redis/howto/connect-with-upstash-redis
- Upstash plan information: https://upstash.com/pricing/redis
