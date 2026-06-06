const fs = require('fs').promises;
const dataPath = require('../config/dataPath');

// Fonctions utilitaires pour lire/écrire dans le fichier JSON
const readData = async () => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur lors de la lecture des données:", error);
        return [];
    }
};

const writeData = async (data) => {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Erreur lors de l'écriture des données:", error);
    }
};

const FILIERES_AUTORISEES = ['DAR', 'RT', 'ASR'];

// --- LOGIQUE DU CRUD ---

// 1. Récupérer tous les étudiants
exports.getAllEtudiants = async (req, res) => {
    const etudiants = await readData();
    res.status(200).json(etudiants);
};

// 2. Récupérer un étudiant par son ID
exports.getEtudiantById = async (req, res) => {
    const etudiants = await readData();
    const etudiant = etudiants.find(e => e.id === parseInt(req.params.id));
    if (etudiant) {
        res.status(200).json(etudiant);
    } else {
        res.status(404).json({ message: "Étudiant non trouvé" });
    }
};

// 3. Ajouter un nouvel étudiant (Admin seulement)
exports.createEtudiant = async (req, res) => {
    const { filiere } = req.body;
    
    // Validation simple de la filière
    if (filiere && !FILIERES_AUTORISEES.includes(filiere)) {
        return res.status(400).json({ message: `Filière invalide. Les options sont : ${FILIERES_AUTORISEES.join(', ')}` });
    }

    const etudiants = await readData();
    const newEtudiant = {
        id: etudiants.length > 0 ? etudiants[etudiants.length - 1].id + 1 : 1, // ID auto-incrémenté
        ...req.body
    };
    etudiants.push(newEtudiant);
    await writeData(etudiants);
    res.status(201).json(newEtudiant);
};

// 4. Modifier un étudiant (Admin seulement)
exports.updateEtudiant = async (req, res) => {
    const { filiere } = req.body;
    if (filiere && !FILIERES_AUTORISEES.includes(filiere)) {
        return res.status(400).json({ message: `Filière invalide. Les options sont : ${FILIERES_AUTORISEES.join(', ')}` });
    }

    const etudiants = await readData();
    const index = etudiants.findIndex(e => e.id === parseInt(req.params.id));
    if (index !== -1) {
        etudiants[index] = { ...etudiants[index], ...req.body };
        await writeData(etudiants);
        res.status(200).json(etudiants[index]);
    } else {
        res.status(404).json({ message: "Étudiant non trouvé" });
    }
};

// 5. Supprimer un étudiant (Admin seulement)
exports.deleteEtudiant = async (req, res) => {
    let etudiants = await readData();
    const initialLength = etudiants.length;
    etudiants = etudiants.filter(e => e.id !== parseInt(req.params.id));
    
    if (etudiants.length < initialLength) {
        await writeData(etudiants);
        res.status(200).json({ message: "Étudiant supprimé avec succès" });
    } else {
        res.status(404).json({ message: "Étudiant non trouvé" });
    }
};
