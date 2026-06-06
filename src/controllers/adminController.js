const path = require('path');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../utils/fileHandler');

const adminsPath = path.join(__dirname, '../data/admins.json');

// Liste des administrateurs
exports.getAllAdmins = async (req, res) => {
    res.json(await readJSON(adminsPath));
};

// Récupérer un administrateur par ID
exports.getAdminById = async (req, res) => {
    const admins = await readJSON(adminsPath);
    const admin = admins.find(a => a.id === parseInt(req.params.id));
    
    if (admin) {
        res.json(admin);
    } else {
        res.status(404).json({ message: "Admin non trouvé" });
    }
};

// Création d'un administrateur
exports.createAdmin = async (req, res) => {
    const admins = await readJSON(adminsPath);
    
    // Utilisation de l'opérateur rest (...) pour extraire le mot de passe et garder le reste des données
    const { password, email, telephone, ...rest } = req.body;

    // Vérification de l'unicité
    if (admins.some(a => a.email === email)) {
        return res.status(400).json({ message: "Erreur : Cet email est déjà utilisé." });
    }
    if (admins.some(a => a.telephone === telephone)) {
        return res.status(400).json({ message: "Erreur : Ce numéro de téléphone est déjà utilisé." });
    }

    // Hachage du mot de passe avec un algorithme de salage (10 tours) pour une sécurité optimale
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = {
        id: admins.length > 0 ? admins[admins.length - 1].id + 1 : 1,
        email,
        telephone,
        ...rest,
        password: hashedPassword
    };

    admins.push(newAdmin);
    await writeJSON(adminsPath, admins);
    res.status(201).json({ message: "Admin créé avec succès" });
};

// Mise à jour d'un administrateur
exports.updateAdmin = async (req, res) => {
    const admins = await readJSON(adminsPath);
    const adminId = parseInt(req.params.id);
    const index = admins.findIndex(a => a.id === adminId);

    if (index !== -1) {
        // Vérification de l'unicité lors de la mise à jour (en ignorant l'admin actuel)
        if (req.body.email && admins.some(a => a.email === req.body.email && a.id !== adminId)) {
            return res.status(400).json({ message: "Erreur : Cet email est déjà utilisé par un autre administrateur." });
        }
        if (req.body.telephone && admins.some(a => a.telephone === req.body.telephone && a.id !== adminId)) {
            return res.status(400).json({ message: "Erreur : Ce numéro de téléphone est déjà utilisé par un autre administrateur." });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        
        admins[index] = { ...admins[index], ...req.body, id: admins[index].id };
        await writeJSON(adminsPath, admins);
        res.json({ message: "Admin mis à jour avec succès" });
    } else {
        res.status(404).json({ message: "Admin non trouvé" });
    }
};

// Suppression d'un administrateur
exports.deleteAdmin = async (req, res) => {
    let admins = await readJSON(adminsPath);
    const initialLength = admins.length;
    
    admins = admins.filter(a => a.id !== parseInt(req.params.id));
    
    if(admins.length < initialLength){
        await writeJSON(adminsPath, admins);
        res.json({ message: "Admin supprimé avec succès" });
    } else {
        res.status(404).json({ message: "Admin non trouvé" });
    }
};
