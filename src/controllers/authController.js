const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readJSON } = require('../utils/fileHandler');
const { SECRET_KEY, tokenBlacklist } = require('../middleware/authMiddleware');

const adminsPath = path.join(__dirname, '../data/admins.json');

// Connexion administrateur
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    // Contrôle de saisie : vérifier que les champs ne sont pas vides
    if (!email || !password) {
        return res.status(400).json({ message: "Erreur : L'email et le mot de passe sont obligatoires." });
    }
    
    const admins = await readJSON(adminsPath);
    const admin = admins.find(u => u.email === email);

    // bcrypt.compare vérifie que le mot de passe en clair correspond au hash sécurisé stocké dans le JSON
    if (admin && await bcrypt.compare(password, admin.password)) {
        // Génération d'un token JWT (JSON Web Token) signé avec notre clé secrète, valide pour 1 heure
        const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: "Identifiants invalides" });
    }
};

// Déconnexion administrateur
exports.logout = (req, res) => {
    // Extraction du token depuis le header
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (token) {
        // Ajout du token à la blacklist
        tokenBlacklist.add(token);
        res.json({ message: "Déconnecté avec succès" });
    } else {
        res.status(400).json({ message: "Token manquant" });
    }
};
