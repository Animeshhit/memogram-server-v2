const { z } = require("zod");

const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    post_image: z.string().nullable().optional(), // Image can be null or undefined
    isDeleted: z.boolean().default(false), // Boolean field validation
});

module.exports = postSchema;
