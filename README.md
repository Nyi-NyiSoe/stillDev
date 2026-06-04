# StillDev

StillDev is a lightweight Next.js MVP for a daily developer sharpness check.

The app gives each user a deterministic 10-question quiz based on their role,
stack, experience level, and the current date. It is intentionally local-only:
no backend, no login, no database, and no AI API.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- `localStorage` for profile, daily quiz state, result, and history
- Static local question bank

## Scripts

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## MVP Routes

- `/` - landing page and start/history entry points
- `/setup` - profile setup
- `/quiz` - daily 10-question quiz
- `/result` - score, rank, weak areas, and explanations
- `/history` - past local quiz results

## Project Structure

```txt
src/
  app/
  components/
  data/
  lib/
  types/
```
