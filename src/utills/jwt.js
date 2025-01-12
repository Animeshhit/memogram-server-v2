const jwt = require("jsonwebtoken");
const {
    ACCESSTOKENEXPIRY,
    REFRESHTOKENEXPIRY,
    ACCESSTOKENSECRET,
    REFRESHTOKENSECRET,
} = require("../utills/jwt.js");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            phone_number: user.phone_number,
        },
        ACCESSTOKENSECRET,
        { expiresIn: ACCESSTOKENEXPIRY },
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
        },
        REFRESHTOKENEXPIRY,
        { expiresIn: REFRESHTOKENSECRET },
    );
};

function decodeToken(token, SECRET_KEY) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return "Token expired";
        }
        if (err.name === "JsonWebTokenError") {
            return "Invalid token";
        }
        throw err; // Unknown error
    }
}

module.exports = { generateAccessToken, generateRefreshToken, decodeToken };
