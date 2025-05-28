const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const generateToken = (user) => {
    return jwt.sign(
        { user_id: user.user_id, role: user.role },
        'your_jwt_secret',
        { expiresIn: '1h' }
    );
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        await User.create({ name, email, password, role });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await User.findByEmail(email);
        const user = rows[0];
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err });
    }
};
