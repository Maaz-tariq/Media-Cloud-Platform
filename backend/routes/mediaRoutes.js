const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");



const {
    getSharedMedia,
    createShareLink,
    uploadMedia,
    getUserMedia,
    deleteMedia,
    searchMedia,
    renameMedia,
    
} = require("../controllers/mediaController");

router.get(
    "/",
    protect,
    getUserMedia);

router.post(
    "/upload",
    protect,
    upload.single("file"),
     uploadMedia);

router.delete(
    "/:id",
    protect,
    deleteMedia
);

router.get(
    "/search",
    protect,
    searchMedia
);

router.patch(
    "/:id/rename",
    protect,
    renameMedia
)

router.post(
    '/:id/share',
     protect,
    createShareLink
);

router.get(
    '/public/share/:id',
    getSharedMedia
);


module.exports = router;