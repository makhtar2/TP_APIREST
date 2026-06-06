const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'secret';
const tokenBlacklist = new Set(); // Liste des tokens qui ne sont plus valides

// Cette fonction s'exécute AVANT les routes protégées
module.exports = (req, res, next) => {
    // On récupère le token dans l'en-tête "Authorization" (Bearer <token>)
    const token = req.headers['authorization']?.split(' ')[1];

    // Si pas de token ou si le token est dans la liste noire
    if (!token || tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Accès refusé. Veuillez vous connecter." });
    }

    try {
        // On vérifie si le token est authentique avec notre clé secrète
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user; // On stocke les infos de l'utilisateur dans la requête
        next(); // On passe à la fonction suivante (le contrôleur)
    } catch (error) {
        res.status(403).json({ message: "Token invalide ou expiré" });
    }
};

module.exports.tokenBlacklist = tokenBlacklist;
module.exports.SECRET_KEY = SECRET_KEY;
