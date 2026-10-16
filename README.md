# Sprint 11 – Fullstack System Integration

This project integrates the Sprint 08 React/Vite Cine-Stream frontend with the Sprint 10 Express/MongoDB backend.

## Architecture

```text
React/Vite (Vercel)
        |
        | REST API + FormData
        v
Express/Node (Render)
        |
        +---- MongoDB Atlas
        |
        +---- Cloudinary (optional image upload)
```

## Features

- React/Vite SPA retained from Sprint 08.
- `/posts` page added for Sprint 11 integration.
- GET posts from MongoDB using `useEffect`.
- POST new documents using `FormData`.
- PUT/edit existing documents.
- DELETE documents and update React state immediately.
- Loading, success, empty and backend-error states.
- CORS configured on Express.
- Multer parses multipart uploads in memory.
- Cloudinary stores uploaded images; only the returned URL is saved in MongoDB.
- Vitest + React Testing Library API-service tests with coverage.
- Vercel/Render environment variable setup.

## Local setup

### 1. Backend

```bash
cd backend
npm install
```

Create `.env` from `.env.example` and add your MongoDB Atlas credentials.

For image uploads also add:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Run:

```bash
npm run dev
```

Backend: `http://localhost:5000`

Health check: `http://localhost:5000/health`

Posts API: `http://localhost:5000/api/posts`

### 2. Frontend

```bash
cd frontend
npm install
```

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000
VITE_TMDB_KEY=your_tmdb_api_key_here
```

Run:

```bash
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

Use the **Posts** navigation item to demonstrate the Sprint 11 pipeline.

## QA testing

From `frontend`:

```bash
npm test
```

Coverage report is generated in `coverage/`.

The included tests verify:

- GET request to `/api/posts`
- multipart `FormData` for POST/PUT
- DELETE request to `/api/posts/:id`

## Deployment

### Backend – Render

Set the backend environment variables:

```env
PORT=10000
MONGO_URI=your_mongodb_atlas_uri
FRONTEND_URL=https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Render start command:

```bash
npm start
```

### Frontend – Vercel

Set:

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_TMDB_KEY=your_tmdb_api_key
```

Important: do **not** leave `VITE_API_URL` as `localhost` in the Vercel production environment.

After changing Vercel environment variables, redeploy the frontend.

## Demo flow (3 minutes)

1. Run `npm test` and show the passing tests + coverage summary.
2. Open the deployed frontend and click **Posts**.
3. Create a post with title/content and optionally an image.
4. Show the new document appearing without a page reload.
5. Hard refresh the browser.
6. Show that the post is still present, proving MongoDB persistence.
7. Edit the post and demonstrate the updated data.
8. Delete the post and show it disappear from the UI.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get one post |
| GET | `/api/posts/top-recent` | Get three recent posts |
| POST | `/api/posts` | Create post; supports multipart image |
| PUT | `/api/posts/:id` | Update post; supports multipart image |
| DELETE | `/api/posts/:id` | Delete post |

## Security notes

Never commit `.env` files or real MongoDB/Cloudinary credentials. Only commit `.env.example` placeholders.
