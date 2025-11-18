const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payments");
const userRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
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


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});
