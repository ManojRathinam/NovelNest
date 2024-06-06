const { Schema, model } = require("mongoose");

const postSchema = new Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: [
            'Adventure', 'Fiction', 'Horror', 'Mystery', 'Paranormal', 
            'Science Fiction', 'Thriller', 'Fantasy', 'Humor', 'Romance', 
            'Historical Fiction', 'Uncategorized'
        ],
        default: 'Uncategorized'
    },
    description: { type: String, required: true },
    summary: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    thumbnail: { type: String }
}, { timestamps: true });

module.exports = model("Post", postSchema);
