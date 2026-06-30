const mediaService = require("../services/mediaService");

const uploadMedia = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const media = await mediaService.uploadMedia(req.file, userId);
    
    res.status(201).json({
      message: "Upload Successful",
      media,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getUserMedia = async (req, res) => {
  try {
    const media = await mediaService.getUserMedia(req.user._id);
    res.status(200).json(media);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const result = await mediaService.deleteMedia(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const renameMedia = async (req, res, next) => {
    try {
        const media = await mediaService.renameMedia(
            req.params.id,
            req.user._id,
            req.body.name
        );

        res.status(200).json({
            success: true,
            message: "Media renamed successfully",
            media
        });

    } catch(error) {
        next(error);
    }
}

const searchMedia = async (req, res, next) => {
  try {
    const { search, type, sort } = req.query;
    
    let page = req.query.page ? parseInt(req.query.page, 10) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

    if (isNaN(page) || page < 1) {
      throw new ApiError(400, "Page must be a valid number greater than 0");
    }
    if (isNaN(limit) || limit < 1) {
      throw new ApiError(400, "Limit must be a valid number greater than 0");
    }

    const options = { search, type, sort, page, limit };
    const paginatedResult = await mediaService.searchMedia(req.user._id, options);
    
    res.status(200).json(paginatedResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMedia,
  getUserMedia,
  deleteMedia,
  renameMedia,
  searchMedia,
};