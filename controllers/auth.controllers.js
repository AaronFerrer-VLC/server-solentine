const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ConflictError, AuthenticationError, ValidationError, AppError } = require('../utils/errors');
const saltRounds = 10;

/**
 * Signup User Controller
 * Creates a new user account
 */
const signupUser = async (req, res, next) => {
    try {
        const { username, email, password, avatar, firstName, familyName, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return next(new ValidationError('Missing required fields', [
                { field: !username ? 'username' : null, message: 'Username is required' },
                { field: !email ? 'email' : null, message: 'Email is required' },
                { field: !password ? 'password' : null, message: 'Password is required' }
            ].filter(e => e.field)));
        }

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
        const userResponse = newUser.toObject ? newUser.toObject() : { ...newUser._doc || newUser };
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

        // Validate required fields
        if (!email || !password) {
            return next(new AuthenticationError('Email and password are required'));
        }

        // Find user by email
        let user;
        try {
            user = await User.findOne({ email });
        } catch (dbError) {
            console.error('Database error in login:', dbError);
            return next(new AppError('Database error during login', 500));
        }

        if (!user) {
            return next(new AuthenticationError('Invalid email or password'));
        }

        // Verify password
        let isCorrectPwd;
        try {
            isCorrectPwd = bcrypt.compareSync(password, user.password);
        } catch (bcryptError) {
            console.error('Bcrypt error in login:', bcryptError);
            return next(new AppError('Password verification error', 500));
        }

        if (!isCorrectPwd) {
            return next(new AuthenticationError('Invalid email or password'));
        }

        // Check if TOKEN_SECRET is configured
        if (!process.env.TOKEN_SECRET) {
            console.error('❌ TOKEN_SECRET is not configured in environment variables');
            const configError = new AppError('Server configuration error: TOKEN_SECRET is missing', 500);
            configError.isOperational = true;
            return next(configError);
        }

        // Validate user has required fields
        if (!user._id) {
            console.error('User missing _id field');
            return next(new AppError('User data error', 500));
        }

        // Generate JWT token
        const payload = { userId: user._id.toString(), role: user.role || 'user' };

        let authToken;
        try {
            authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                algorithm: 'HS256',
                expiresIn: process.env.JWT_EXPIRES_IN || "6h",
            });
        } catch (jwtError) {
            console.error('JWT signing error:', jwtError);
            return next(new AppError('Failed to generate authentication token', 500));
        }

        // Remove password from user object safely
        let userResponse;
        try {
            userResponse = user.toObject ? user.toObject() : { ...(user._doc || user) };
            delete userResponse.password;
        } catch (objError) {
            console.error('Error converting user to object:', objError);
            // Fallback: create a safe user object
            userResponse = {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                firstName: user.firstName,
                familyName: user.familyName
            };
        }

        res.json({
            status: 'success',
            message: 'Login successful',
            authToken,
            user: userResponse
        });
    } catch (err) {
        console.error('Login error:', err);
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
