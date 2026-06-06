const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readJSON } = require('../utils/fileHandler');
const { SECRET_KEY, tokenBlacklist } = require('../middleware/authMiddleware');

const adminsPath = path.join(__dirname, '../data/admins.json');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const admins = await readJSON(adminsPath);
    const admin = admins.find(u => u.username === username);

    if (admin && await bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: "Identifiants invalides" });
    }
};

exports.logout = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        tokenBlacklist.add(token);
        res.json({ message: "Déconnecté" });
    } else {
        res.status(400).json({ message: "Token manquant" });
    }
};
