const MONGODBURL = process.env.MONGODB_URL || "";
const ACCESSTOKENSECRET =
    process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
const REFRESHTOKENSECRET =
    process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret";
const ACCESSTOKENEXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "1d";
const REFRESHTOKENEXPIRY = process.env.REFRESH_TOKEN_EXPIR || "2d";

module.exports = {
    MONGODBURL,
    ACCESSTOKENEXPIRY,
    REFRESHTOKENEXPIRY,
    ACCESSTOKENSECRET,
    REFRESHTOKENSECRET,
};
