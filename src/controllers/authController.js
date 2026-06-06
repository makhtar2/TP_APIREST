const path = require('path');
const jwt = require('jsonwebtoken');

const { readJSON } = require('../utils/fileHandler');
const { SECRET_KEY, tokenBlacklist } = require('../middleware/authMiddleware');

const adminsPath = path.join(__dirname, '../data/admins.json');

// Connexion administrateur
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    // Vérifie si les champs sont remplis
    if (!email || !password) {
        return res.status(400).json({ message: "Erreur : L'email et le mot de passe sont obligatoires." });
    }
    
    const admins = await readJSON(adminsPath);
    const admin = admins.find(u => u.email === email);

    // Vérifie si le mot de passe est correct
    if (admin && admin.password === password) {
        // Génère un token JWT valide 1h
        const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: "Identifiants invalides" });
    }
};

// Déconnexion administrateur
exports.logout = (req, res) => {
    // Récupère le token du header
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (token) {
        // Bloque le token (déconnexion)
        tokenBlacklist.add(token);
        res.json({ message: "Déconnecté avec succès" });
    } else {
        res.status(400).json({ message: "Token manquant" });
    }
};
