const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payments");
const userRoutes = require("./routes/users");
const adminChatRoutes = require("./routes/adminChat");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://bouncecure-payment.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
console.log("Loading user routes...");
app.use("/api/users", userRoutes);
console.log("User routes loaded.");

app.use("/api/admin/chat", adminChatRoutes);
app.use("/api/admin/users", require("./routes/users"));

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});
