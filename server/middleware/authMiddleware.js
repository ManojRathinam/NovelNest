const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
        return next(new HttpError('Unauthorized. No token', 402));
    }

    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return next(new HttpError('Unauthorized. Invalid token.', 403));
        }
        req.user = decodedToken;
        next();
    });
};

module.exports = authMiddleware;
