const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ConflictError, AuthenticationError } = require('../utils/errors');
const saltRounds = 10;

/**
 * Signup User Controller
 * Creates a new user account
 */
const signupUser = async (req, res, next) => {
    try {
        const { username, email, password, avatar, firstName, familyName, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return next(new ConflictError('Email already registered'));
            }
            if (existingUser.username === username) {
                return next(new ConflictError('Username already taken'));
            }
        }

        // Hash password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create user (role is set to 'user' by default unless explicitly set to 'admin' by admin)
        const userRole = role === 'admin' && req.user?.role === 'admin' ? 'admin' : 'user';

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            avatar,
            firstName,
            familyName,
            role: userRole
        });

        // Remove password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            user: userResponse
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Login User Controller
 * Authenticates user and returns JWT token
 */
const loginUser = async (req, res, next) => {
    try {
        const { password, email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return next(new AuthenticationError('Invalid email or password'));
        }

        // Verify password
        const isCorrectPwd = bcrypt.compareSync(password, user.password);

        if (!isCorrectPwd) {
            return next(new AuthenticationError('Invalid email or password'));
        }

        // Generate JWT token
        const payload = { userId: user._id, role: user.role };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: process.env.JWT_EXPIRES_IN || "6h",
        });

        // Remove password from user object
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            status: 'success',
            message: 'Login successful',
            authToken,
            user: userResponse
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Verify User Controller
 * Returns current authenticated user data
 */
const verifyUser = (req, res, next) => {
    try {
        const userResponse = req.user.toObject();
        delete userResponse.password;

        res.json({
            status: 'success',
            loggedUserData: userResponse
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signupUser,
    loginUser,
    verifyUser,
};
