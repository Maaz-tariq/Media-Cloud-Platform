const supabase = require("../config/supabase");
const Media = require("../models/Media");
const { v4: uuidv4 } = require("uuid");

const uploadMedia = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const uniqueName =
            uuidv4() + "-" + req.file.originalname;

        // Upload to Supabase
        const { data, error } =
            await supabase.storage
                .from("media-files")
                .upload(uniqueName, req.file.buffer, {
                    contentType: req.file.mimetype
                });

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        // Get public URL
        const {
            data: { publicUrl }
        } = supabase.storage
            .from("media-files")
            .getPublicUrl(uniqueName);

        // Detect media type
        let mediaType = "other";

        if (req.file.mimetype.startsWith("image"))
            mediaType = "image";

        else if (req.file.mimetype.startsWith("video"))
            mediaType = "video";

        else if (req.file.mimetype.startsWith("audio"))
            mediaType = "audio";

        // Save metadata
        const media = await Media.create({

            user: req.user.id,

            fileName: req.file.originalname,

            fileType: req.file.mimetype,

            mediaType,

            fileSize: req.file.size,

            fileUrl: publicUrl,

            storagePath: uniqueName

        });

        res.status(201).json({
            message: "Upload Successful",
            media
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getUserMedia = async (req, res) => {
    try {
        const media = await Media.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        res.status(200).json(media);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}

module.exports = {
    uploadMedia,
    getUserMedia
};