const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const protect  = require('../middlewares/authMiddleware');


router.post('/media/:mediaId/shares', protect, shareController.createShareLink);

router.get('/media/:mediaId/shares', protect, shareController.listShareLinks);


router.patch('/shares/:token/revoke', protect, shareController.revokeShareLink);


router.get('/public/shares/:token', shareController.getShareMetadata);

router.get('/public/shares/:token/download', shareController.downloadSharedFile);


module.exports = router;