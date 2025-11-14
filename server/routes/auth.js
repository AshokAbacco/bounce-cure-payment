const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ token: "admin-token" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;
