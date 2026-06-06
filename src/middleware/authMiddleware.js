const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'secret';
const tokenBlacklist = new Set(); // Liste des tokens désactivés

// Middleware de sécurité
module.exports = (req, res, next) => {
    // Récupère le token
    const token = req.headers['authorization']?.split(' ')[1];

    // Rejette l'accès si invalide
    if (!token || tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Accès refusé. Veuillez vous connecter." });
    }

    try {
        // Vérifie le token
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user; // Sauvegarde l'utilisateur
        next(); // Autorise l'accès
    } catch (error) {
        res.status(403).json({ message: "Token invalide ou expiré" });
    }
};

module.exports.tokenBlacklist = tokenBlacklist;
module.exports.SECRET_KEY = SECRET_KEY;
