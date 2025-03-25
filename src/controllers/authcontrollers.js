const User = require("../models/users/model.js");
const {
    hashPassword,
    comparePassword,
    generateUniqueUsername,
} = require("../utills/bcrypt.js");
const {
    registerSchema,
    loginSchema,
} = require("../validations/authValidations.js");
const {
    generateAccessToken,
    generateRefreshToken,
    decodeToken,
} = require("../utills/jwt.js");
const { ACCESSTOKENSECRET, REFRESHTOKENSECRET } = require("../env.js");

const login = async (req, res) => {
    // Validate request body using safeParse
    const validationResult = loginSchema.safeParse(req.body);

    // If validation fails, return a 400 response with error details
    if (!validationResult.success) {
        const errors = validationResult.error.errors.map((err) => err.message);
        return res.status(400).json({ errors });
    }

    // Destructure validated data
    const { email, phone_number, password } = validationResult.data;

    try {
        // Ensure either email or phone number is provided
        if (!email && !phone_number) {
            return res.status(400).json({
                error: "Either email or phone number is required for login.",
            });
        }

        // Find the user by email or phone number
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: "Invalid email/phone number or password.",
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                error: "Invalid password.",
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Respond with success (you might include a JWT token here for authentication)
        res.status(200).json({
            message: "Login successful!",
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                profile_picture: user.profile_picture,
            },
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({
            error: "An error occurred during login: " + error.message,
        });
    }
};

//register user
const register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { email, name, phone_number, password } = validatedData;

        // Check if both email and phone number are missing
        if (!email && !phone_number) {
            return res.status(400).json({
                error: "Either email or phone number is required for registration.",
            });
        }

        // Check if the password is provided
        if (!password) {
            return res.status(400).json({
                error: "Password is required.",
            });
        }

        // Check if the email or phone number is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: "A user with the provided email or phone number already exists.",
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const newUser = new User({
            name,
            email: email || null, // Use null if email is not provided
            phone_number: phone_number || null, // Use null if phone number is not provided
            password: hashedPassword,
            username: generateUniqueUsername(email),
        });

        // Save the user to the database
        await newUser.save();

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        // Respond with success
        res.status(201).json({
            message: "User registered successfully!",
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                name: newUser.name,
                email: newUser.email,
                phone_number: newUser.phone_number,
                profile_picture: newUser.profile_picture,
            },
        });
    } catch (error) {
        if (error.name === "ZodError") {
            const errors = error.errors.map((err) => err.message);
            return res.status(400).json({ errors });
        }
        // Handle any errors
        res.status(500).json({
            error: "An error occurred during registration: " + error.message,
        });
    }
};

const signIn = async (req, res) => {
    const { token } = req.body; // Access token from body
    const refreshToken = req.headers["authorization"]?.split(" ")[1];

    try {
        if (!token) {
            return res
                .status(400)
                .json({ error: "Access token is required in the body" });
        }

        if (!refreshToken) {
            return res.status(400).json({
                error: "Refresh token is required in the Authorization header",
            });
        }

        let decodedData = decodeToken(token, ACCESSTOKENSECRET);

        if (decodedData === "Token expired") {
            // Token expired, try to refresh using the refresh token
            let refreshDecodedData;
            try {
                refreshDecodedData = decodeToken(
                    refreshToken,
                    REFRESHTOKENSECRET,
                );
            } catch (err) {
                return res.status(400).json({ error: "Invalid refresh token" });
            }

            const userId = refreshDecodedData._id;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const newAccessToken = generateAccessToken(user);

            res.status(200).json({
                access_token: newAccessToken,
                user: {
                    name: user.name,
                    email: user.email,
                    phone_number: user.phone_number,
                    profile_picture: user.profile_picture,
                },
            });
        } else if (decodedData === "Invalid token") {
            return res.status(400).json({ error: "Invalid access token" });
        }

        // If the access token is valid, return the decoded data to the user
        return res.status(200).json({
            message: "Token is valid",
            user: decodedData, // Include decoded data (which contains user info)
        });
    } catch (err) {
        // Catch any errors and send a generic error response
        console.error("Unexpected error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = { login, register, signIn };
