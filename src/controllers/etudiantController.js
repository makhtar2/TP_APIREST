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
    
    // Contrôle de saisie strict : champs obligatoires
    if (!nom || !prenom || !email || !filiere || !niveau) {
        return res.status(400).json({ message: "Erreur : Tous les champs (nom, prenom, email, filiere, niveau) sont obligatoires." });
    }
    
    // Validation de la filière
    if (filiere && !FILIERES.includes(filiere)) {
        return res.status(400).json({ message: "Filière invalide. Choisissez parmi : " + FILIERES.join(', ') });
    }

    const etudiants = await readJSON(dataPath);

    // Vérification de l'unicité de l'email
    if (email && etudiants.some(e => e.email === email)) {
        return res.status(400).json({ message: "Erreur : Cet email est déjà utilisé." });
    }

    // Génération automatique du matricule unique
    const annee = new Date().getFullYear();
    const newId = etudiants.length > 0 ? etudiants[etudiants.length - 1].id + 1 : 1;
    // padStart(3, '0') transforme "5" en "005"
    const matriculeGenere = `MAT${annee}${newId.toString().padStart(3, '0')}`;
    
    const newEtudiant = {
        id: newId,
        matricule: matriculeGenere, // On force le matricule généré (ignore celui du req.body s'il y en a un)
        // L'opérateur spread (...) permet de décomposer et de copier automatiquement toutes les propriétés reçues (nom, prenom, etc.)
        ...req.body
    };
    
    // Si l'utilisateur avait envoyé un "matricule" dans req.body, il a été copié, donc on l'écrase par sécurité
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
        // Vérification de l'unicité de l'email
        if (req.body.email && etudiants.some(e => e.email === req.body.email && e.id !== etudiantId)) {
            return res.status(400).json({ message: "Erreur : Cet email est déjà utilisé par un autre étudiant." });
        }

        etudiants[index] = { 
            ...etudiants[index], 
            ...req.body, 
            id: etudiants[index].id,
            matricule: etudiants[index].matricule // On s'assure que le matricule ne peut pas être modifié
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
