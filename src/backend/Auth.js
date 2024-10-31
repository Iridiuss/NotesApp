//middleware to handle jwt auth
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    // Check if token is present
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
        }

        // Token is valid, save decoded data to request for future use
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
