const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routers/userRouter");
const articleRoutes = require("./routers/articleRouter");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

// === MONGODB CONNECTION ===
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => {
  console.log("✅ MongoDB Atlas connected successfully.");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// === ROUTES ===
app.get("/running", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api/users", userRoutes);
app.use("/api/article", articleRoutes);

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
