const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        default: "Anonymous",
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    username: {
        type: String,
        unique: true,
        sparse: true, // Allows null values while maintaining uniqueness
        validate: {
            validator: function (v) {
                return !v || /^[a-zA-Z0-9_.]+$/.test(v); // Optional: Alphanumeric, underscores, dots
            },
            message:
                "Username can only contain letters, numbers, underscores, and dots.",
        },
    },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^\S+@\S+\.\S+$/.test(v); // Optional: Basic email validation
            },
            message: "Please enter a valid email address.",
        },
    },
    phone_number: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^\+?[0-9]{10,15}$/.test(v); // Optional: Valid phone number
            },
            message: "Phone number must be valid and between 10-15 digits.",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    bio: {
        type: String,
        maxlength: [160, "Bio cannot exceed 160 characters"],
    },
    profile_picture: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(v); // Optional: Valid image URL
            },
            message: "Profile picture must be a valid image URL.",
        },
    },
    cover_image: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(v);
            },
            message: "Cover image must be a valid image URL.",
        },
    },
    joined_on: {
        type: Date,
        required: [true, "Joined on date is required"],
        default: Date.now,
    },
});

// Custom validation to ensure either email or phone number is provided
UserSchema.pre("validate", function (next) {
    if (!this.email && !this.phone_number) {
        this.invalidate("email", "Either email or phone number is required.");
        this.invalidate(
            "phone_number",
            "Either phone number or email is required.",
        );
    }
    next();
});

// Export the model
const User = mongoose.model("User", UserSchema);
module.exports = User;
