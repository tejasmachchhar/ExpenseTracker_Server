const jwt = require('jsonwebtoken');
const UserModels = require('../models/UserModels');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    // console.log('Token from frontend: '+token);
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, async (err, valid) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                // console.log('Valid token: ', valid);
                req.userId = valid.userId; // Attach userId to request object
                next();
            }
        }); // Use the secret key from .env
        // console.log('Decoded:', decoded);
        const user = await UserModels.findById(decoded.userId);
        // console.log('User from token:', req.userId);
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;