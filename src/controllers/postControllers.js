const postSchema = require("../validations/postValidations");
const Post = require("../models/posts/posts");

// Create a new post
const createANewPost = async (req, res) => {
    try {
        const validationResult = postSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                errors: validationResult.error.errors.map((err) => err.message),
            });
        }

        const { title, post_image } = validationResult.data;
        const newPost = await new Post({
            title,
            post_image,
            userId: req.user._id,
        }).save();

        await newPost.populate("userId", "name email"); // Populate user details
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Update a post
const updateANewPost = async (req, res) => {
    try {
        const { id } = req.query;
        const { title, post_image } = req.body;

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { title, post_image, updated_on: Date.now() },
            { new: true },
        ).populate("userId", "name email");

        if (!updatedPost)
            return res.status(404).json({ message: "Post not found" });

        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Soft delete a post
const deleteAPost = async (req, res) => {
    try {
        const { id } = req.query;

        const post = await Post.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true },
        );

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get all posts (excluding deleted posts)
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ isDeleted: false })
            .populate("userId", "name email")
            .populate("likes.userId", "name email")
            .populate("comments.userId", "name email");

        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get a single post
const getAPost = async (req, res) => {
    try {
        const { id } = req.query;

        const post = await Post.findOne({ _id: id, isDeleted: false })
            .populate("userId", "name email")
            .populate("likes.userId", "name email")
            .populate("comments.userId", "name email");

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Like a post
const likePost = async (req, res) => {
    try {
        const { postId } = req.query;

        const post = await Post.findOneAndUpdate(
            { _id: postId, isDeleted: false },
            { $addToSet: { likes: { userId: req.user._id } } },
            { new: true },
        ).populate("likes.userId", "name email");

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json({ message: "Post liked successfully", post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Unlike a post
const unlikePost = async (req, res) => {
    try {
        const { postId } = req.query;

        const post = await Post.findOneAndUpdate(
            { _id: postId, isDeleted: false },
            { $pull: { likes: { userId: req.user._id } } },
            { new: true },
        ).populate("likes.userId", "name email");

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json({ message: "Post unliked successfully", post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Add a comment
const addComment = async (req, res) => {
    try {
        const { postId } = req.query;
        const { text } = req.body;

        const post = await Post.findOneAndUpdate(
            { _id: postId, isDeleted: false },
            { $push: { comments: { userId: req.user._id, text } } },
            { new: true },
        ).populate("comments.userId", "name email");

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json({ message: "Comment added successfully", post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Update a comment
const updateComment = async (req, res) => {
    try {
        const { postId, commentId } = req.query;
        const { text } = req.body;

        const post = await Post.findOneAndUpdate(
            { _id: postId, "comments._id": commentId, isDeleted: false },
            { $set: { "comments.$.text": text } },
            { new: true },
        ).populate("comments.userId", "name email");

        if (!post)
            return res
                .status(404)
                .json({ message: "Post or comment not found" });

        res.status(200).json({ message: "Comment updated successfully", post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.query;

        const post = await Post.findOneAndUpdate(
            { _id: postId, isDeleted: false },
            { $pull: { comments: { _id: commentId } } },
            { new: true },
        ).populate("comments.userId", "name email");

        if (!post)
            return res
                .status(404)
                .json({ message: "Post or comment not found" });

        res.status(200).json({ message: "Comment deleted successfully", post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    createANewPost,
    updateANewPost,
    deleteAPost,
    getAllPosts,
    getAPost,
    likePost,
    unlikePost,
    addComment,
    updateComment,
    deleteComment,
};
