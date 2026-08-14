# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Lingolumo frontend

Frontend client for the existing FastAPI + SQLite Duolingo-style backend.
The backend and database are the source of truth; this app only renders their data.

### API configuration
Set the backend base URL in `.env`:

```
VITE_API_URL=http://localhost:8000
```

(see `.env.example`). All requests go through `src/lib/api.ts`; backend JSON
types live in `src/lib/types.ts`.

### Endpoints used
`GET /api/users/{id}`, `GET /api/courses`, `GET /api/courses/{id}/units`,
`GET /api/units/{id}/skills`, `GET /api/lessons/{id}`,
`GET /api/users/{id}/progress`, `GET /api/users/{id}/mistakes`,
`POST /api/lessons/{id}/answer`, `POST /api/lessons/{id}/complete`.

### Routes
`/` learning path · `/lesson/$lessonId` lesson player · `/leaderboard` ·
`/profile` · `/settings`.

### Not API-backed (clearly isolated)
- `src/components/leaderboard/Leaderboard.tsx` — seeded rival rows (no leaderboard endpoint exists); your own row is live.
- `src/components/profile/AchievementCard.tsx` — static badge definitions unlocked from live progress.
- Hearts are decremented in lesson-session state only; the backend has no heart endpoint.
