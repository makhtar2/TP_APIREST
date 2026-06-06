const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Point d'accès pour se connecter
router.post('/login', authController.login);

// Point d'accès pour se déconnecter
router.post('/logout', authController.logout);

module.exports = router;
