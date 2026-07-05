# IAs Academy

IAs Academy is an Expo learner app backed by a Next.js admin console and API.

## Local setup

Requirements: Node.js 22+, Corepack, and PostgreSQL/Neon.

1. Copy `.env.example` to `.env.local` and replace every placeholder.
2. Enable Yarn: `corepack enable`.
3. Install exactly from the lockfile: `corepack yarn install --immutable`.
4. Run the Better Auth database migration for the installed Better Auth version.
5. Apply `apps/web/db/migrations/001_job_prep.sql` to the same database.
6. Create the first account, then promote it once from a trusted database console:
   `UPDATE "user" SET role = 'admin' WHERE email = 'owner@example.com';`
7. Start the web/API app: `corepack yarn workspace web dev`.

Never expose the database URL, auth secret, OAuth secrets, session tokens, or production signing credentials through a `NEXT_PUBLIC_` or `EXPO_PUBLIC_` variable.

## Quality gates

Run these before every release:

```sh
corepack yarn install --immutable
corepack yarn workspace web typecheck
corepack yarn workspace mobile tsc --noEmit
corepack yarn workspace web test
corepack yarn workspace mobile test
corepack yarn workspace web build
```

## Release checklist

- Use separate development, staging, and production databases.
- Set production HTTPS URLs in all auth and public URL variables.
- Replace the Google Mobile Ads test IDs in `apps/mobile/app.json` or remove ads.
- Configure Sentry, OAuth redirect URLs, RevenueCat products, privacy policy, terms, support URL, and account-deletion instructions.
- Confirm `in.iasacademy.app` is owned and available; change it before the first store build if needed. Bundle/package IDs cannot be casually changed after publishing.
- Build signed iOS and Android release candidates with EAS and test login, enrollment, restore-purchase, notifications, deep links, and account deletion on physical devices.
- Capture store screenshots, content ratings, data-safety/privacy disclosures, export compliance, and reviewer credentials.
- Back up the production database and document rollback steps before deploying migrations.

## Authorization model

New users receive the `student` role. Every admin API performs server-side role authorization. Do not promote users from client code or expose a public role-update endpoint.
