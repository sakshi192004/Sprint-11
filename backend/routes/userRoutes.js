const express = require("express");
const User = require("../models/User");

const router = express.Router();

// POST /users - create a user for author relationship testing
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({ name, email });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user",
      error: error.message
    });
  }
});

// GET /users - list users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
});

module.exports = router;