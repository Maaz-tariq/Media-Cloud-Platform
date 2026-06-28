const crypto = require('crypto');
const Media = require('../models/Media'); // Adjust path as needed
const ShareLink = require('../models/ShareLink'); 
const ApiError = require('../utils/ApiError'); // Adjust path as needed



const createShareLink = async (userId, mediaId, expiresInDays) => {

  const media = await Media.findOne({ _id: mediaId, user: userId });
  
  if (!media) {
    throw new ApiError(404, "Media not found or you do not have permission to share it");
  }

  const token = crypto.randomBytes(16).toString('hex');

  let expiresAt = null;
  if (expiresInDays) {
    const parsedDays = parseInt(expiresInDays, 10);
    if (isNaN(parsedDays) || parsedDays < 1) {
      throw new ApiError(400, "expiresInDays must be a valid number greater than 0");
    }
    
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parsedDays);
  }

  const shareLink = await ShareLink.create({
    mediaId,
    owner: userId,
    token,
    expiresAt,
    isActive: true,
    downloads: 0
  });

  return shareLink;
};


const getValidShareLink = async (token) => {

  const link = await ShareLink.findOne({ token }).populate('mediaId');

  if (!link) {
    throw new ApiError(404, "Share link not found");
  }

  if (!link.isActive) {
    throw new ApiError(410, "This share link has been revoked by the owner");
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    throw new ApiError(410, "This share link has expired");
  }

  return link;
};

const getShareMetadata = async (token) => {
  const link = await getValidShareLink(token);
  
  return {
    token: link.token,
    expiresAt: link.expiresAt,
    media: {
      fileName: link.mediaId.fileName,
      fileSize: link.mediaId.fileSize,
      mediaType: link.mediaId.mediaType
    }
  };
};

const processDownload = async (token) => {
  const link = await getValidShareLink(token);

  link.downloads += 1;
  await link.save();

  return link.mediaId.fileUrl; 
};

const listShareLinks = async (userId, mediaId) => {
  const links = await ShareLink.find({ mediaId, owner: userId })
    .sort({ createdAt: -1 }); 

  return links;
};

const revokeShareLink = async (userId, token) => {
 
  const link = await ShareLink.findOneAndUpdate(
    { token, owner: userId }, 
    { isActive: false }, 
    { new: true }
  );

  if (!link) {
    throw new ApiError(404, "Share link not found or you do not have permission to revoke it");
  }

  return link;
};

module.exports = {
  createShareLink,
  getShareMetadata,
  processDownload,
  listShareLinks,
  revokeShareLink
};