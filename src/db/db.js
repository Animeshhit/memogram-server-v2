const mongoose = require("mongoose");
const { MONGODBURL } = require("../env.js");

const connectToDataBase = async (next) => {
    try {
        await mongoose.connect(MONGODBURL);
        next();
    } catch (err) {
        console.log(`Failed To Connect Database : ${err}`);
        process.exit();
    }
};

module.exports = connectToDataBase;
