# Railway Deployment

## Services

Create one Railway project with:

- A GitHub service connected to this repository.
- A PostgreSQL service.
- A persistent volume for profile uploads.

## Application Variables

Set these variables on the Next.js service:

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
AUTH_SECRET=<new-random-secret>
NEXTAUTH_URL=https://<railway-domain>
NEXT_PUBLIC_APP_URL=https://<railway-domain>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<smtp-user>
SMTP_PASSWORD=<new-smtp-app-password>
SMTP_FROM=bunediyola destek <support@example.com>
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<strong-admin-password>
```

Generate `AUTH_SECRET` with:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Do not reuse the local `.env` secrets in production.

## Database

Add a PostgreSQL service, then reference its `DATABASE_URL` from the application
service. Railway runs `npx prisma migrate deploy` before each deployment through
`railway.json`.

Run the seed once from the Railway application service:

```text
npm run prisma:seed
```

## Profile Upload Volume

Attach a volume to the application service at:

```text
/app/.next/standalone/public/uploads
```

Without this volume, uploaded profile images disappear after a redeployment.

## Domain

Generate a Railway domain from the application service Networking settings. Set
both URL variables to the generated HTTPS address, then redeploy:

```text
NEXTAUTH_URL=https://example.up.railway.app
NEXT_PUBLIC_APP_URL=https://example.up.railway.app
```

The healthcheck endpoint is:

```text
/api/health
```

`services.mailConfigured` must be `true`. For Gmail, `SMTP_PASSWORD` must be a
Google App Password, not the normal account password. Enable two-step
verification, generate a new app password, and store it only in Railway.
