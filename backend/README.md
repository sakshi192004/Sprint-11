# Sprint 10 – Fullstack MongoDB Atlas + Mongoose

This project migrates the Sprint 09 in-memory blog API to persistent MongoDB Atlas storage using Mongoose ODM.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- Postman

## Features

### Phase 1
- MongoDB Atlas connection
- Secure `MONGO_URI` through `.env`
- Mongoose `Post` schema
- Strict fields: `title`, `content`, `createdAt`

### Phase 2
- `POST /posts`
- `GET /posts`
- `GET /posts/:id`
- `DELETE /posts/:id`
- Postman testing

### Phase 3
- `User` schema
- `Post.authorId` reference
- `.populate()` for author information
- `GET /posts/top-recent` for top 3 newest posts

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Copy `.env.example` to `.env`.

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/sprint10?retryWrites=true&w=majority
```

Never commit `.env`.

### 3. MongoDB Atlas

Create an M0 free cluster.

In Atlas:
1. Create a database user.
2. Open Network Access.
3. Add your current IP address.
4. For the assignment's troubleshooting requirement, you may temporarily use `0.0.0.0/0`, but restrict access again when practical.
5. Copy the connection string and put it in `.env`.

### 4. Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server:

`http://localhost:5000`

## Postman QA

### Create User

POST `http://localhost:5000/users`

```json
{
  "name": "Sakshi",
  "email": "sakshi@example.com"
}
```

Copy the returned `_id`.

### Create Post

POST `http://localhost:5000/posts`

```json
{
  "title": "My First MongoDB Post",
  "content": "This post is stored in MongoDB Atlas.",
  "authorId": "PASTE_USER_ID_HERE"
}
```

Expected status: `201 Created`

### Get Posts

GET `http://localhost:5000/posts`

Expected status: `200 OK`

### Get One Post

GET `http://localhost:5000/posts/POST_ID`

### Delete Post

DELETE `http://localhost:5000/posts/POST_ID`

Expected status: `200 OK`

### Top 3 Recent Posts

GET `http://localhost:5000/posts/top-recent`

This returns up to three posts sorted by `createdAt` descending.

## Deployment

Deploy the Express application on Render or Railway.

Add this environment variable in the hosting dashboard:

`MONGO_URI=<your MongoDB Atlas URI>`

Do not put the real MongoDB URI in GitHub.

## Sprint 10 Demo – Maximum 3 Minutes

1. Show the running API.
2. Open Postman.
3. Create a user.
4. Create a post.
5. GET `/posts` and show the populated author.
6. Show `/posts/top-recent`.
7. Open MongoDB Atlas and show the stored document.
8. Optionally delete a test post and show the response.

## Security Checklist

- [ ] `.env` exists locally.
- [ ] `.env` is in `.gitignore`.
- [ ] No real MongoDB password appears in source code.
- [ ] No real connection string appears in README.
- [ ] Postman tests pass.
- [ ] MongoDB Atlas contains the inserted documents.
