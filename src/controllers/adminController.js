const path = require('path');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../utils/fileHandler');

const adminsPath = path.join(__dirname, '../data/admins.json');

// Lister les admins
exports.getAllAdmins = async (req, res) => {
    res.json(await readJSON(adminsPath));
};

// Créer un admin (avec hachage du mot de passe)
exports.createAdmin = async (req, res) => {
    const admins = await readJSON(adminsPath);
    const { password, ...rest } = req.body;

    // On hache le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = {
        id: admins.length > 0 ? admins[admins.length - 1].id + 1 : 1,
        ...rest,
        password: hashedPassword
    };

    admins.push(newAdmin);
    await writeJSON(adminsPath, admins);
    res.status(201).json({ message: "Admin créé avec succès" });
};

// Supprimer un admin
exports.deleteAdmin = async (req, res) => {
    let admins = await readJSON(adminsPath);
    admins = admins.filter(a => a.id !== parseInt(req.params.id));
    await writeJSON(adminsPath, admins);
    res.json({ message: "Admin supprimé" });
};
