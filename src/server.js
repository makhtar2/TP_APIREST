require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const etudiantRoutes = require('./routes/etudiantRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de logging pour voir les requêtes dans le terminal
app.use(morgan('dev'));
app.use(express.json());

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/etudiants', (req, res, next) => {
    if (req.method === 'GET') {
        return next();
    }
    authMiddleware(req, res, next);
}, etudiantRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API de gestion des étudiants (Version Pro)');
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Mode: ${process.env.NODE_ENV}`);
});
