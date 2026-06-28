const ShareLinkSchema = new Schema({
    mediaId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Media", 
        required: true 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    token: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    expiresAt: { 
        type: Date, 
        default: null 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    downloads: { 
        type: Number, 
        default: 0 
    }
}, { 
    timestamps: true 
});