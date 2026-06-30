const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video", "audio", "other"],
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },
    storagePath: {
    type: String,
    required: true
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Media", mediaSchema);
