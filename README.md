# Family Fantasy Cricket

Corrected React + Express + Redis project for one Vercel deployment.

**Start with DEPLOYMENT_GUIDE.md.** It covers online deployment, local Windows
setup, administrator scoring and the live checks to perform before inviting players.

Local quick start (Node 22):

```sh
npm ci
npm --prefix frontend ci
npm run setup:local
npm run build:frontend
npm start
```

Open http://localhost:5000. `npm test` runs isolated regression suites.

This is a custom manual-scoring ODI tournament, not an official ICC service.
Verify the sample squads and configure actual fixture dates in the admin panel.
