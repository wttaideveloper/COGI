# Troubleshooting

## Public site shows fallback content

Strapi is offline or CORS/URL misconfigured. Verify `VITE_STRAPI_URL` and that Strapi is running on port 1337.

## Strapi: unable to open database file

Create the SQLite folder: `mkdir strapi-backend\.tmp` then restart `npm run develop`.

## Strapi: enumeration invalid

Enum values must start with a letter (e.g. use `permanent_301` not `301`).

## Admin login fails against Strapi

Use demo credentials `admin@cogi.local` / `admin123` for UI review, or create a Users & Permissions user in Strapi and use that email/password.

## Port already in use

Change ports in each app's `vite.config.ts` or stop the process using 5173/5174/1337.

## Corrupted node_modules (Windows)

Stop all Node processes, delete `node_modules`, run `npm install` again.

## GiveLively widget missing

Set `VITE_GIVELIVELY_URL` once the ministry provides the form URL; the Donate page shows a configured embed/placeholder until then.
