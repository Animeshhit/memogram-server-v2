const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const PostSchema = new Schema(
    {
        likes: [
            {
                userId: { type: Types.ObjectId, ref: "User" },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        title: {
            type: String,
            required: true,
        },
        post_image: {
            type: String,
            default: null,
        },
        comments: [
            {
                userId: { type: Types.ObjectId, ref: "User" },
                text: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Post", PostSchema);
