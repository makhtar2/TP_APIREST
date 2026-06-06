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
    const { filiere, email, nom, prenom, niveau } = req.body;
    
    // Vérifie les champs obligatoires
    if (!nom || !prenom || !email || !filiere || !niveau) {
        return res.status(400).json({ message: "Erreur : Tous les champs (nom, prenom, email, filiere, niveau) sont obligatoires." });
    }
    
    // Vérifie si la filière est valide
    if (filiere && !FILIERES.includes(filiere)) {
        return res.status(400).json({ message: "Filière invalide. Choisissez parmi : " + FILIERES.join(', ') });
    }

    const etudiants = await readJSON(dataPath);

    // Empêche les doublons d'email
    if (email && etudiants.some(e => e.email === email)) {
        return res.status(400).json({ message: "Erreur : Cet email est déjà utilisé." });
    }

    // Crée un matricule automatique (ex: MAT2026005)
    const annee = new Date().getFullYear();
    const newId = etudiants.length > 0 ? etudiants[etudiants.length - 1].id + 1 : 1;
    // Ajoute des zéros devant l'ID
    const matriculeGenere = `MAT${annee}${newId.toString().padStart(3, '0')}`;
    
    const newEtudiant = {
        id: newId,
        matricule: matriculeGenere, // On force le matricule généré (ignore celui du req.body s'il y en a un)
        // Copie toutes les données reçues
        ...req.body
    };
    
    // Protège le matricule généré
    newEtudiant.matricule = matriculeGenere;
    
    etudiants.push(newEtudiant);
    await writeJSON(dataPath, etudiants);
    
    res.status(201).json(newEtudiant);
};

// Mettre à jour un étudiant
exports.updateEtudiant = async (req, res) => {
    const etudiants = await readJSON(dataPath);
    const etudiantId = parseInt(req.params.id);
    const index = etudiants.findIndex(e => e.id === etudiantId);

    if (index !== -1) {
        // Empêche les doublons d'email
        if (req.body.email && etudiants.some(e => e.email === req.body.email && e.id !== etudiantId)) {
            return res.status(400).json({ message: "Erreur : Cet email est déjà utilisé par un autre étudiant." });
        }

        etudiants[index] = { 
            ...etudiants[index], 
            ...req.body, 
            id: etudiants[index].id,
            matricule: etudiants[index].matricule // Empêche la modification du matricule
        };
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
