// Importation des bibliothèques nécessaires
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const etudiantRoutes = require('./routes/etudiantRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des middlewares globaux
app.use(morgan('dev')); // Affiche les logs des requêtes dans le terminal
app.use(express.json()); // Permet au serveur de comprendre le format JSON

// Définition des routes de l'API
app.use('/api/auth', authRoutes); // Routes pour la connexion/déconnexion

// Protection des routes étudiants : consultation libre (GET), modification réservée aux admins
app.use('/api/etudiants', (req, res, next) => {
    if (req.method === 'GET') {
        return next(); // Tout le monde peut voir
    }
    authMiddleware(req, res, next); // Seuls les admins connectés peuvent modifier
}, etudiantRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API de gestion des étudiants (Version Pro)');
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Mode: ${process.env.NODE_ENV}`);
});
