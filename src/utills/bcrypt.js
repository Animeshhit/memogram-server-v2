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

function generateUniqueUsername(email) {
    if (!email || typeof email !== "string" || !email.includes("@")) {
        throw new Error("Invalid email address provided.");
    }

    // Extract the part before the "@" symbol
    const baseUsername = email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    // Append a random number or timestamp for uniqueness
    const uniqueSuffix = Math.floor(Math.random() * 10000); // Random 4-digit number

    // Combine base username and suffix
    const uniqueUsername = `${baseUsername}${uniqueSuffix}`;

    return uniqueUsername;
}

module.exports = { hashPassword, comparePassword, generateUniqueUsername };
