const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');

router.get('/', etudiantController.getAllEtudiants);
router.get('/:id', etudiantController.getEtudiantById);
router.post('/', etudiantController.createEtudiant);
router.put('/:id', etudiantController.updateEtudiant);
router.delete('/:id', etudiantController.deleteEtudiant);

module.exports = router;
