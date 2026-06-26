const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
    uploadMedia
} = require("../controllers/mediaController");

router.post(
    "/upload",
    protect,
    upload.single("file"),
    uploadMedia
);

module.exports = router;