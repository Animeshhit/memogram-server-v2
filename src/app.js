const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middlewares/authmiddleware.js");

//setup router
const router = require("./routes/index.js");
const postRouter = require("./routes/posts/route.js");

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "https://memogram-v2.vercel.app/"],
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setup routes
app.use("/api/v1", router);
app.use("/api/v1", authMiddleware, postRouter);

console.log();

module.exports = app;
