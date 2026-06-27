const supabase = require("../config/supabase");
const Media = require("../models/Media");
const { v4: uuidv4 } = require("uuid");

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const uniqueName = uuidv4() + "-" + req.file.originalname;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("media-files")
      .upload(uniqueName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("media-files").getPublicUrl(uniqueName);

    // Detect media type
    let mediaType = "other";

    if (req.file.mimetype.startsWith("image")) mediaType = "image";
    else if (req.file.mimetype.startsWith("video")) mediaType = "video";
    else if (req.file.mimetype.startsWith("audio")) mediaType = "audio";

    // Save metadata
    const media = await Media.create({
      user: req.user.id,

      fileName: req.file.originalname,

      fileType: req.file.mimetype,

      mediaType,

      fileSize: req.file.size,

      fileUrl: publicUrl,

      storagePath: uniqueName,
    });

    res.status(201).json({
      message: "Upload Successful",
      media,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserMedia = async (req, res) => {
  try {
    const media = await Media.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        message: "Media not found",
      });
    }

    if (media.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const { error } = await supabase.storage
      .from("media-files")
      .remove([media.storagePath]);

    if (error) {
      return res.status(500).json({
        message: "Failed to delete file from Supabase",
      });
    }

    await media.deleteOne();

    res.status(200).json({
      message: "Media deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Media not found",
    });
  }
};

const renameMedia = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body;

    if (typeof name !== "string" || !name || !name.trim()) {
      return res.status(400).json({
        message: "Filename cannot be empty or blank",
      });
    }

    name = name.trim();

    const userInputLastDot = name.lastIndexOf(".");
    if (userInputLastDot !== -1) {
      name = name.substring(0, userInputLastDot);
    }

    if (!name.trim()) {
      return res.status(400).json({
        message: "Filename body cannot be empty",
      });
    }

    if (name.length > 255) {
      return res.status(400).json({
        message: "Filename exceeds maximum length of 255 characters",
      });
    }

    const dangerousChars = /[\/\\:\*\?"<>\|]|\.\./;
    if (dangerousChars.test(name)) {
      return res.status(400).json({
        message: "Invalid characters detected",
      });
    }

    const mediaItem = await Media.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!mediaItem) {
      return res.status(404).json({
        message: "Media not found",
      });
    }


    const originalLastDotIndex = mediaItem.fileName.lastIndexOf(".");
    const extension = originalLastDotIndex !== -1 ? mediaItem.fileName.substring(originalLastDotIndex) : "";

    const newFileName = name + extension;

    if (mediaItem.fileName === newFileName) {
      return res.status(200).json({
        message: "Filename is the same.",
        media: mediaItem,
      });
    }

    mediaItem.fileName = newFileName;
    await mediaItem.save();

    res.status(200).json({
      message: "File renamed successfully",
      media: mediaItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const searchMedia = async (req, res) => {
  try {
    const { query, type } = req.query;
    
    // Scopes search results exclusively to the authenticated user
    const searchQuery = { user: req.user._id };

    // Case-insensitive regex match for filenames if query string exists
    if (query && query.trim()) {
      searchQuery.fileName = { $regex: query.trim(), $options: "i" };
    }

    // Optional filtering by mediaType (image, video, audio, other)
    if (type && type.trim()) {
      searchQuery.mediaType = type.trim();
    }

    const media = await Media.find(searchQuery).sort({ createdAt: -1 });

    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to search media files",
    });
  }
};

module.exports = {
  uploadMedia,
  getUserMedia,
  deleteMedia,
  searchMedia,
  renameMedia,
};
