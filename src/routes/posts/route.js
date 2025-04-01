const express = require("express");
const router = express.Router();
const {
    getAllPosts,
    getAPost,
    createANewPost,
    updateANewPost,
    deleteAPost,
    likePost,
    unlikePost,
    addComment,
    updateComment,
    deleteComment,
} = require("../../controllers/postControllers");

router.get("/posts", getAllPosts);
router.get("/post", getAPost);
router.post("/post", createANewPost);
router.put("/post", updateANewPost);
router.delete("/post", deleteAPost);

router.post("/like", likePost);
router.post("/dislike", unlikePost);
router.post("/comment", addComment);
router.put("/comment", updateComment);
router.delete("/comment", deleteComment);

module.exports = router;
