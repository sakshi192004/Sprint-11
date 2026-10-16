const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Post", postSchema);
