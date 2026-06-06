const dataPath = require('../config/dataPath');
const { readJSON, writeJSON } = require('../utils/fileHandler');

const FILIERES = ['DAR', 'RT', 'ASR'];

// Liste des étudiants
exports.getAllEtudiants = async (req, res) => {
    res.json(await readJSON(dataPath));
};

// Récupérer un étudiant par ID
exports.getEtudiantById = async (req, res) => {
    const etudiants = await readJSON(dataPath);
    const etudiant = etudiants.find(e => e.id === parseInt(req.params.id));
    
    if (etudiant) {
        res.json(etudiant);
    } else {
        res.status(404).json({ message: "Étudiant non trouvé" });
    }
};

// Ajouter un étudiant
exports.createEtudiant = async (req, res) => {
    const { filiere } = req.body;
    
    // Validation de la filière
    if (filiere && !FILIERES.includes(filiere)) {
        return res.status(400).json({ message: "Filière invalide. Choisissez parmi : " + FILIERES.join(', ') });
    }

    const etudiants = await readJSON(dataPath);
    
    const newEtudiant = {
        id: etudiants.length > 0 ? etudiants[etudiants.length - 1].id + 1 : 1,
        // L'opérateur spread (...) permet de décomposer et de copier automatiquement toutes les propriétés reçues (nom, prenom, etc.)
        ...req.body
    };
    
    etudiants.push(newEtudiant);
    await writeJSON(dataPath, etudiants);
    
    res.status(201).json(newEtudiant);
};

// Mettre à jour un étudiant
exports.updateEtudiant = async (req, res) => {
    const etudiants = await readJSON(dataPath);
    const index = etudiants.findIndex(e => e.id === parseInt(req.params.id));

    if (index !== -1) {
        etudiants[index] = { ...etudiants[index], ...req.body, id: etudiants[index].id };
        await writeJSON(dataPath, etudiants);
        res.json({ message: "Étudiant mis à jour avec succès", etudiant: etudiants[index] });
    } else {
        res.status(404).json({ message: "Étudiant non trouvé" });
    }
};

// Supprimer un étudiant
exports.deleteEtudiant = async (req, res) => {
    let etudiants = await readJSON(dataPath);
    const initialLength = etudiants.length;
    
    etudiants = etudiants.filter(e => e.id !== parseInt(req.params.id));
    
    if (etudiants.length < initialLength) {
        await writeJSON(dataPath, etudiants);
        res.json({ message: "Étudiant supprimé avec succès" });
    } else {
        res.status(404).json({ message: "Étudiant non trouvé" });
    }
};
