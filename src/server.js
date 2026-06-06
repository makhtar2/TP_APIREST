require('dotenv').config(); // Variables d'environnement
const express = require('express'); // Framework web
const morgan = require('morgan'); // Logger
const etudiantRoutes = require('./routes/etudiantRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000; // Port du serveur

// Middlewares globaux
app.use(morgan('dev')); // Logs console
app.use(express.json()); // Parse le JSON

// Sécurité : Évite le plantage si le format JSON n'est pas précisé par le client
app.use((req, res, next) => {
    if (!req.body) req.body = {};
    next();
});

// Routes principales
app.use('/api/auth', authRoutes); // Auth
app.use('/api/admins', adminRoutes); // Admins

// Routes Étudiants (GET public, reste protégé)
app.use('/api/etudiants', (req, res, next) => {
    if (req.method === 'GET') return next(); // Autorise GET
    authMiddleware(req, res, next); // Vérifie le token pour POST/PUT/DELETE
}, etudiantRoutes);

// Accueil
app.get('/', (req, res) => res.send('API Gestion Étudiants v1.0'));

// Démarrage
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
