const router = require("express").Router();

//auth routes
const authRouter = require("./auth/route.js");

router.use("/auth", authRouter);

module.exports = router;
