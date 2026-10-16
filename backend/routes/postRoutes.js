const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const Post = require("../models/Post");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "sprint11-posts", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

// GET /api/posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
});

// GET /api/posts/top-recent
router.get("/top-recent", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "name email")
      .sort({ createdAt: -1 })
      .limit(3);
    res.json({ count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent posts", error: error.message });
  }
});

// GET /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("authorId", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: "Invalid post ID", error: error.message });
  }
});

// POST /api/posts - accepts JSON or multipart/form-data
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    let imageUrl = "";
    if (req.file) {
      if (!cloudinaryConfigured) {
        return res.status(500).json({
          message: "Image upload is not configured. Add Cloudinary credentials to .env."
        });
      }
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const post = await Post.create({ title, content, authorId: authorId || undefined, imageUrl });
    const populatedPost = await post.populate("authorId", "name email");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: "Failed to create post", error: error.message });
  }
});

// PUT /api/posts/:id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { title, content } = req.body;
    if (title !== undefined) post.title = title.trim();
    if (content !== undefined) post.content = content.trim();

    if (req.file) {
      if (!cloudinaryConfigured) {
        return res.status(500).json({
          message: "Image upload is not configured. Add Cloudinary credentials to .env."
        });
      }
      const result = await uploadToCloudinary(req.file.buffer);
      post.imageUrl = result.secure_url;
    }

    await post.save();
    const populatedPost = await post.populate("authorId", "name email");
    res.json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: "Failed to update post", error: error.message });
  }
});

// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully", post: deletedPost });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete post", error: error.message });
  }
});

module.exports = router;
