const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';
let tokenBlacklist = new Set();

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Token révoqué. Veuillez vous reconnecter." });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: "Token invalide ou expiré." });
    }
};

module.exports.tokenBlacklist = tokenBlacklist;
module.exports.SECRET_KEY = SECRET_KEY;
