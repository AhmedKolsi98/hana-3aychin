# هانا عايشين

Hana 3aychin (هانا عايشين) is a practical, citizen-built digital guide for living through recurring outages, extreme heat, and daily infrastructure stress.

The project is designed as a lightweight, offline-first knowledge base that helps households make better decisions when electricity, water, communication, or basic services become unreliable.

## What this project is

This app collects useful, actionable guidance in a simple mobile-friendly format. Instead of relying on scattered tips across social media or private chats, it centralizes neighborhood-level survival information into one accessible reference.

The content is organized around the kinds of challenges people face in real life:

- electrical safety and appliance protection
- water storage and purification
- heat stress and emergency health guidance
- food preservation and safe storage
- remote work continuity during outages
- emergency contacts and useful apps
- household lighting and security
- passive cooling and resilient home practices

## Why it exists

The project was created to answer a simple need: when systems fail, people need reliable, easy-to-use information that is available even without internet access.

It focuses on practical, low-tech, life-saving advice that can be immediately applied in homes, apartments, and communities.

## Key features

- Offline-first experience using a PWA approach
- Mobile-friendly Arabic interface
- Structured article content by topic
- Emergency numbers and practical checklists
- Simple navigation for quick access during stress or outages
- Open-source knowledge base that can be improved by contributors

## Project structure

```bash
src/
  components/       reusable UI and layout pieces
  data/             section metadata and app content references
  hooks/            app logic and helpers
  lib/              routing, content sync, and app utilities
  pages/            route-based screens and article views
  App.tsx           root application shell
public/
  content/          markdown guides, and _meta.json (sections + emergency numbers)
  content-manifest.json  generated — see below, never edit by hand
scripts/
  build-manifest.mjs     rebuilds the manifest and validates the content
```

## Content workflow

Everything the app lists — the sections, their order and icons, the emergency
numbers, and the guides themselves — is content, not code:

- `public/content/_meta.json` declares the sections and the emergency numbers.
- `public/content/<slug>.md` is one guide, with a small frontmatter block.

`public/content-manifest.json` is **generated** from those two. Run:

```bash
npm run manifest
```

after any content change (it also runs automatically before `npm run build`).
If anything is inconsistent — a guide pointing at a section that does not
exist, an icon that is not in the whitelist, a phone number a handset could
not dial — the command names the offending entry and stops without writing,
so a broken guide never reaches a deploy.

### Adding a section

1. Add an entry to `sections` in `_meta.json`: an `id`, an `order`, an `icon`
   from the whitelist in `scripts/validate.mjs`, and `title` / `sub` with
   at least their Arabic text.
2. Drop one or more `.md` guides into `public/content/` whose frontmatter
   `section:` matches that `id`.
3. Run `npm run manifest`.

No TypeScript involved — the section appears in the sidebar, on the home
grid, and at `#/<id>`. Run `npm test` to check the tooling itself.

## Main content areas

The app is organized around core life-safety themes:

- Electricity and protection
- Water and purification
- Health and heat resilience
- Food security and refrigeration
- Remote work and connectivity
- Emergency applications and contacts
- Lighting and household safety
- Passive cooling and resilient design

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui-inspired component system
- Markdown-based content storage
- IndexedDB-backed offline sync
- Progressive Web App support

## Running locally

```bash
npm install
npm run dev
```

Then open the local Vite URL in the browser.

To build for production:

```bash
npm run build
```

## Contributing

This project is meant to be open and collaborative.

You can contribute by:

- improving existing articles
- adding new practical guides
- clarifying advice for local conditions
- translating or adapting content for broader access
- improving usability and accessibility

Content changes need no build step beyond `npm run manifest` — see the content
workflow above.

## Important note

This project is a practical information resource, not a substitute for professional emergency or medical advice. In critical situations, always follow local authorities, trained professionals, and official emergency services.

## License

This project is open-source and intended for community utility. Check the repository license for details.

## Summary

Hana 3aychin is a resilience toolkit for everyday crisis conditions: a simple app that turns complex advice into practical, accessible guidance when people need it most.
