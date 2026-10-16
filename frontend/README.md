# Cine-Stream — Sprint 08

A Netflix-lite React SPA for discovering movies using the TMDB REST API.

## Implemented

### Phase 1 — Mandatory
- TMDB Popular Movies API
- Responsive CSS Grid
- Poster, title, release year and rating
- TMDB Search endpoint
- Loading, error and empty states
- Missing-poster fallback

### Phase 2 — Performance
- Native `IntersectionObserver` infinite scroll
- Appends page N+1 without replacing existing results
- 500ms debounced search
- Favorites with `localStorage`
- Dedicated `/favorites` route

### Phase 3 — Asset Optimization
- Native `<img loading="lazy">`

> The AI Mood Matcher is intentionally not included in this baseline because an LLM API key must never be exposed directly in a client-side Vite bundle. If you implement it later, put the LLM request behind a server/serverless function.

## Setup

1. Install Node.js.
2. Open this project in VS Code.
3. Install dependencies:

```bash
npm install
```

4. Copy `.env.example` to `.env`.
5. Put your TMDB v3 API key in `.env`:

```env
VITE_TMDB_KEY=your_tmdb_api_key_here
```

6. Start the development server:

```bash
npm run dev
```

7. Open the local URL shown by Vite.

## Vercel

Set this environment variable in the Vercel project:

`VITE_TMDB_KEY`

Then redeploy.

## Project structure

```text
cine-stream/
├── src/
│   ├── components/
│   │   └── MovieCard.jsx
│   ├── services/
│   │   └── tmdb.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## QA demo checklist

1. Open Discover and show popular movies.
2. Scroll to the bottom and show page 2/page 3 being appended.
3. Type a search term quickly and show that the request happens after the 500ms pause rather than on every keystroke.
4. Click a heart.
5. Open Favorites.
6. Refresh the browser and show the favorite is still present.

## Important

Do not commit `.env` or any secret API key to GitHub. Keep `.env` in `.gitignore` and configure the key in Vercel Environment Variables for deployment.