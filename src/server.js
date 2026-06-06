// require permet d'importer des outils (bibliothèques)
require('dotenv').config(); // Charge les variables du fichier .env
const express = require('express'); // Framework pour créer le serveur
const morgan = require('morgan'); // Pour voir les requêtes dans la console
const etudiantRoutes = require('./routes/etudiantRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000; // Utilise le port du .env ou 3000 par défaut

// Middlewares : fonctions qui s'exécutent à chaque requête
app.use(morgan('dev')); // Affiche "GET /api/... 200" dans le terminal
app.use(express.json()); // Permet de lire les données envoyées en JSON (req.body)

// Association des préfixes d'URL aux fichiers de routes
app.use('/api/auth', authRoutes); // Authentification
app.use('/api/admins', adminRoutes); // Gestion des admins

// Routes étudiants : GET est public, le reste demande d'être connecté (authMiddleware)
app.use('/api/etudiants', (req, res, next) => {
    if (req.method === 'GET') return next(); // On laisse passer si c'est juste de la lecture
    authMiddleware(req, res, next); // Sinon, on vérifie le token
}, etudiantRoutes);

// Route d'accueil simple
app.get('/', (req, res) => res.send('API Gestion Étudiants v1.0'));

// Démarrage du serveur sur le port choisi
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
