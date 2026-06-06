const dataPath = require('../config/dataPath');
const { readJSON, writeJSON } = require('../utils/fileHandler');

const FILIERES = ['DAR', 'RT', 'ASR'];

exports.getAllEtudiants = async (req, res) => {
    res.json(await readJSON(dataPath));
};

exports.createEtudiant = async (req, res) => {
    const { filiere } = req.body;
    if (filiere && !FILIERES.includes(filiere)) {
        return res.status(400).json({ message: "Filière invalide" });
    }

    const etudiants = await readJSON(dataPath);
    const newEtudiant = {
        id: etudiants.length > 0 ? etudiants[etudiants.length - 1].id + 1 : 1,
        ...req.body
    };
    etudiants.push(newEtudiant);
    await writeJSON(dataPath, etudiants);
    res.status(201).json(newEtudiant);
};

exports.deleteEtudiant = async (req, res) => {
    let etudiants = await readJSON(dataPath);
    const initialLength = etudiants.length;
    etudiants = etudiants.filter(e => e.id !== parseInt(req.params.id));
    
    if (etudiants.length < initialLength) {
        await writeJSON(dataPath, etudiants);
        res.json({ message: "Étudiant supprimé" });
    } else {
        res.status(404).json({ message: "Étudiant non trouvé" });
    }
};
