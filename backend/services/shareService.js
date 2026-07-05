const crypto = require('crypto');
const Media = require('../models/Media'); // Adjust path as needed
const { ShareLink } = require('../models/ShareLink');
const ApiError = require('../utils/ApiError'); // Adjust path as needed



const createShareLink = async (userId, mediaId, expiresInDays) => {

  const media = await Media.findOne({ _id: mediaId, user: userId });
  if (!media) {
    throw new ApiError(404, "Media not found or permission denied");
  }

  const existingLink = await ShareLink.findOne({ 
    mediaId, 
    owner: userId, 
    isActive: true 
  });
  
  if (existingLink) {
    return existingLink;
  }

  const token = crypto.randomBytes(16).toString('hex');

 
  let expiresAt = null;
  if (expiresInDays) {
    const parsedDays = parseInt(expiresInDays, 10);
    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
      throw new ApiError(400, "Expiration must be between 1 and 365 days");
    }
    
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parsedDays);
  }

  return await ShareLink.create({
    mediaId,
    owner: userId,
    token,
    expiresAt,
    isActive: true,
    downloads: 0
  });
};

const validateShareLink = async (token) => {
  
  const link = await ShareLink.findOne({ token })
    .populate('mediaId', 'fileName fileSize mediaType fileUrl');

  if (!link) throw new ApiError(404, "Share link not found");
  if (!link.isActive) throw new ApiError(410, "This share link has been revoked");
  if (link.expiresAt && link.expiresAt < new Date()) {
    throw new ApiError(410, "This share link has expired");
  }

  return link;
};

const getShareMetadata = async (token) => {
  const link = await validateShareLink(token);
  
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
  const link = await validateShareLink(token);

  await ShareLink.updateOne(
    { _id: link._id }, 
    { $inc: { downloads: 1 } }
  );

  return {
    fileUrl: link.mediaId.fileUrl,
    fileName: link.mediaId.fileName
  };
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