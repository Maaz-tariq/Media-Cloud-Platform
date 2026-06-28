const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const connectDB = require("./config/db");
const mediaRoutes = require("./routes/mediaRoutes");
const shareRoutes = require('./routes/shareRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Server Running");
});

const PORT = process.env.PORT || 5000;

app.get("/api/profile", protect, (req, res) => {
    res.json({
        message: "Protected Route Accessed",
        user: req.user
    });
});

app.use("/api/media", mediaRoutes);

app.use('/api', shareRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});