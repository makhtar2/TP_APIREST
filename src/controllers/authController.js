const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET_KEY, tokenBlacklist } = require('../middleware/authMiddleware');

const usersPath = path.join(__dirname, '../data/users.json');

const readUsers = async () => {
    const data = await fs.readFile(usersPath, 'utf8');
    return JSON.parse(data);
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const users = await readUsers();
    
    const user = users.find(u => u.username === username);

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ 
            message: "Connexion réussie",
            token: token 
        });
    } else {
        res.status(401).json({ message: "Identifiants incorrects" });
    }
};

exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        tokenBlacklist.add(token);
        res.status(200).json({ message: "Déconnexion réussie. Token révoqué." });
    } else {
        res.status(400).json({ message: "Aucun token fourni pour la déconnexion." });
    }
};
