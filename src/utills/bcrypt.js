const bcrypt = require("bcrypt");

// Function to hash a password
const hashPassword = async (password) => {
    try {
        const saltRounds = 10; // Number of salt rounds for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password: " + error.message);
    }
};

// Function to compare a plain text password with a hashed password
const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error("Error comparing password: " + error.message);
    }
};

module.exports = { hashPassword, comparePassword };
