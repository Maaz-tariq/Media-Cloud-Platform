const supabase = require("../config/supabase");
const Media = require("../models/Media");
const { v4: uuidv4 } = require("uuid");

const uploadMedia = async (file, userId) => {
  if (!file) {
    const error = new Error("No file uploaded");
    error.status = 400;
    throw error;
  }

  const uniqueName = uuidv4() + "-" + file.originalname;

  // Upload to Supabase
  const { data, error: uploadError } = await supabase.storage
    .from("media-files")
    .upload(uniqueName, file.buffer, {
      contentType: file.mimetype,
    });

  if (uploadError) {
    const error = new Error(uploadError.message);
    error.status = 500;
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("media-files")
    .getPublicUrl(uniqueName);

  // Detect media type
  let mediaType = "other";
  if (file.mimetype.startsWith("image")) mediaType = "image";
  else if (file.mimetype.startsWith("video")) mediaType = "video";
  else if (file.mimetype.startsWith("audio")) mediaType = "audio";

  // Save metadata
  const media = await Media.create({
    user: userId,
    fileName: file.originalname,
    fileType: file.mimetype,
    mediaType,
    fileSize: file.size,
    fileUrl: publicUrl,
    storagePath: uniqueName,
  });

  return media;
};

const getUserMedia = async (userId) => {
  return await Media.find({ user: userId }).sort({ createdAt: -1 });
};

const deleteMedia = async (mediaId, userId) => {
  const media = await Media.findById(mediaId);

  if (!media) {
    const error = new Error("Media not found");
    error.status = 404;
    throw error;
  }

  if (media.user.toString() !== userId.toString()) {
    const error = new Error("Unauthorized");
    error.status = 403;
    throw error;
  }

  const { error: removeError } = await supabase.storage
    .from("media-files")
    .remove([media.storagePath]);

  if (removeError) {
    const error = new Error("Failed to delete file from Supabase");
    error.status = 500;
    throw error;
  }

  await media.deleteOne();
  return { message: "Media deleted successfully" };
};

const renameMedia = async (id, userId, name) => {
  if (typeof name !== "string" || !name || !name.trim()) {
    const error = new Error("Filename cannot be empty or blank");
    error.status = 400;
    throw error;
  }

  let Tname = name.trim();

  const userInputLastDot = Tname.lastIndexOf(".");
  if (userInputLastDot !== -1) {
    Tname = Tname.substring(0, userInputLastDot);
  }

  if (!Tname.trim()) {
    const error = new Error("Filename body cannot be empty");
    error.status = 400;
    throw error;
  }

  if (Tname.length > 255) {
    const error = new Error("Filename exceeds maximum length of 255 characters");
    error.status = 400;
    throw error;
  }

  const dangerousChars = /[\/\\:\*\?"<>\|]|\.\./;
  if (dangerousChars.test(Tname)) {
    const error = new Error("Invalid characters detected");
    error.status = 400;
    throw error;
  }

  const mediaItem = await Media.findOne({ _id: id, user: userId });

  if (!mediaItem) {
    const error = new Error("Media not found");
    error.status = 404;
    throw error;
  }

  const originalLastDotIndex = mediaItem.fileName.lastIndexOf(".");
  const extension = originalLastDotIndex !== -1 ? mediaItem.fileName.substring(originalLastDotIndex) : "";
  const newFileName = Tname + extension;

  if (mediaItem.fileName === newFileName) {
    return mediaItem; 
  }

  mediaItem.fileName = newFileName;
  await mediaItem.save();

  return mediaItem;
};

const searchMedia = async (userId, options) => {
  let { search, type, sort = 'newest', page, limit } = options;

  const searchQuery = { user: userId };

  if (search && search.trim()) {
    searchQuery.fileName = { $regex: search.trim(), $options: 'i' };
  }

  if (type && type.trim()) {
    searchQuery.mediaType = type.trim();
  }

  let sortQuery = {};
  switch (sort) {
    case 'oldest':
      sortQuery = { createdAt: 1 };
      break;
    case 'largest':
      sortQuery = { fileSize: -1 };
      break;
    case 'smallest':
      sortQuery = { fileSize: 1 };
      break;
    case 'newest':
    default:
      sortQuery = { createdAt: -1 };
      break;
  }

  const totalResults = await Media.countDocuments(searchQuery);
  
  const totalPages = Math.ceil(totalResults / limit) || 1;

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * limit;

  const media = await Media.find(searchQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit);

  return {
    currentPage: page,
    totalPages,
    totalResults,
    media
  };
};

module.exports = {
  uploadMedia,
  getUserMedia,
  deleteMedia,
  renameMedia,
  searchMedia,
};