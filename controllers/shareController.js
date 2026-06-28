const shareService = require("../services/shareService");

const createShareLink = async (req, res, next) => {
  try {
    const { mediaId } = req.params;
    const { expiresInDays } = req.body; 
    const userId = req.user._id;

    const shareLink = await shareService.createShareLink(userId, mediaId, expiresInDays);

    const shareUrl = `${req.protocol}://${req.get('host')}/api/public/shares/${shareLink.token}`;

    res.status(200).json({
      message: "Share link retrieved successfully",
      shareUrl,
      shareLink
    });
  } catch (error) {
    next(error);
  }
};

const getShareMetadata = async (req, res, next) => {
  try {
    const { token } = req.params;
    const metadata = await shareService.getShareMetadata(token);

    res.status(200).json(metadata);
  } catch (error) {
    next(error);
  }
};

const downloadSharedFile = async (req, res, next) => {
  try {
    const { token } = req.params;
    const fileUrl = await shareService.processDownload(token);

    res.redirect(fileUrl);
  } catch (error) {
    next(error);
  }
};


const listShareLinks = async (req, res, next) => {
  try {
    const { mediaId } = req.params;
    const userId = req.user._id;

    const links = await shareService.listShareLinks(userId, mediaId);

    res.status(200).json({
      totalLinks: links.length,
      links
    });
  } catch (error) {
    next(error);
  }
};

const revokeShareLink = async (req, res, next) => {
  try {
    const { token } = req.params;
    const userId = req.user._id;

    const revokedLink = await shareService.revokeShareLink(userId, token);

    res.status(200).json({
      message: "Share link has been permanently revoked",
      link: revokedLink
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShareLink,
  listShareLinks,
  revokeShareLink,
  getShareMetadata,
  downloadSharedFile
};