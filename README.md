# 🚀 Sprint 11 – Full Stack System Integration

A full-stack web application that integrates a React frontend with a Node.js and Express backend, using MongoDB for persistent data storage and Cloudinary for image uploads.

This project demonstrates frontend-backend integration, REST API development, database operations, image management, and automated testing.

---
## 🔗Links

Live:- https://sprint-11-bice.vercel.app/

Video:- https://drive.google.com/file/d/10GPT3C5xr6rH3JYX5txp43uFejMeFvBj/view?usp=sharing

GitHub:- https://github.com/sakshi192004/Sprint-11

---

## 📌 Project Overview

Sprint 11 focuses on integrating a React application with a backend REST API and a cloud-hosted NoSQL database.

The application allows users to create, view, update, and delete posts. Users can also upload images with their posts using Cloudinary.

Post data is stored in MongoDB, allowing created posts to remain available after refreshing the application.

---

## ✨ Features

- **Create Posts:** Add a post with a title and content.
- **View Posts:** Retrieve and display saved posts from the backend.
- **Update Posts:** Edit existing posts.
- **Delete Posts:** Remove posts with confirmation.
- **Image Upload:** Upload post thumbnails using Cloudinary.
- **Persistent Storage:** Store post data in MongoDB.
- **REST API Integration:** Connect the React frontend with the Express backend.
- **Form Validation:** Validate required title and content fields.
- **Error Handling:** Display errors when API requests fail.
- **Responsive Interface:** Use the application across supported screen sizes.
- **Automated Testing:** Test API services and React component behaviour with Vitest.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- HTML5
- CSS3
- Vitest
- React Testing Library

### Backend
- Node.js
- Express.js
- REST API
- Multer

### Database and Cloud Services
- MongoDB Atlas
- Mongoose
- Cloudinary

### Development Tools
- Git
- GitHub
- Postman
- Visual Studio Code
- npm

---

## 📂 Project Structure

```text
Sprint-11/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Posts.jsx
│   │   │   └── MovieCard.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── tmdb.js
│   │   │
│   │   ├── test/
│   │   │   ├── api.test.js
│   │   │   └── Posts.test.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env
│
└── README.md