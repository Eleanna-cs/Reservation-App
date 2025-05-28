const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token or bad format');
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        console.log('Decoded token:', decoded);  
        req.user = decoded;
        console.log('Authenticated user:', req.user); 
        next();
    } catch (err) {
      
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
