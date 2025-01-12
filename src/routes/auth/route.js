const router = require("express").Router();
const {
    login,
    register,
    signIn,
} = require("../../controllers/authcontrollers.js");

router.post("/login", login);
router.post("/register", register);
router.get("/login", signIn);

module.exports = router;
