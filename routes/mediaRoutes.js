const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
    uploadMedia,
    getUserMedia
} = require("../controllers/mediaController");

router.get("/", protect, getUserMedia);

router.post("/upload", protect, upload.single("file"), uploadMedia);

module.exports = router;