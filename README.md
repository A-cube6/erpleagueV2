# ERPLeague Australia Website

A clean Next.js website package built from the ERPLeague Australia Website Developer Specification.

## Stack

- Next.js App Router
- React + TypeScript
- Plain CSS design system using the specification tokens
- Vercel-ready deployment
- GitHub-ready repository structure
- No backend required in the current version
- No `node_modules` included in the zip

## Pages included

- `/` Homepage
- `/services` Services overview with anchors for all 9 services
- `/grow-with-sap` GROW with SAP landing page
- `/industries` Industry page
- `/partner` Partner program page
- `/portal` Client portal entry page
- `/login` Client login page with User ID and Password fields
- `/privacy` Privacy policy

## Run locally in VS Code

```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Build locally

```bash
npm run build
npm run start
```

## Deploy to GitHub + Vercel

1. Create a new GitHub repository.
2. Unzip this project and commit the files.
3. Push to GitHub.
4. In Vercel, create a new project from the GitHub repo.
5. Vercel should auto-detect Next.js.
6. Deploy.
7. Add the custom domain `erpleague.com.au` in Vercel when ready.

## Important notes

- The client login page is a front-end-only preview and does not authenticate against a backend yet. Connect it to Supabase Auth, Auth0, or another identity provider before using it for real client access.
- Do not show real client data until authentication, organisation-level permissions and database Row Level Security are implemented.
- SAP Partner, GROW with SAP, NetSuite and Oracle logos should be added only when approved licensed assets are available.
- Contact and partner forms currently show a front-end success message only. Add an API route, FormSubmit, Supabase, HubSpot, or similar integration when ready.

## npm install troubleshooting

If `npm install` tries to download packages from `packages.applied-caas-gateway1.internal.api.openai.org`, delete any existing `package-lock.json` and `node_modules`, then run:

```bash
npm cache clean --force
npm install --registry=https://registry.npmjs.org/
```

This project includes a `.npmrc` pointing to the public npm registry so VS Code, GitHub and Vercel installs should use the normal public package source.
