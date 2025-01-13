const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const signupUser = (req, res, next) => {
    const { username, email, password, avatar, firstName, familyName, role } = req.body;

    if (email === '' || password === '' || username === '') {
        return res.status(400).json({ message: "Provide email, password and name" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Provide a valid email address.' });
    }

    if (password.length < 3) {
        return res.status(400).json({ message: 'Password too short.' });
    }

    User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(409).json({ message: 'Usuario ya registrado' });
            }

            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            return User.create({ username, email, password: hashedPassword, avatar, firstName, familyName, role });
        })
        .then(newUser => res.status(201).json(newUser))
        .catch(err => next(err));
};

const loginUser = async (req, res, next) => {
    const { password, email } = req.body;

    if (email === '' || password === '') {
        return res.status(400).json({ message: 'Provide username and password.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        const isCorrectPwd = bcrypt.compareSync(password, user.password);

        if (!isCorrectPwd) {
            return res.status(401).json({ message: "Unable to authenticate the user" });
        }

        const payload = { userId: user._id, role: user.role };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: "6h",
        });

        return res.json({ authToken, userId: user._id });
    } catch (err) {
        next(err);
    }
};

const verifyUser = (req, res, next) => {
    res.json({ loggedUserData: req.user });
};

module.exports = {
    signupUser,
    loginUser,
    verifyUser,
};
