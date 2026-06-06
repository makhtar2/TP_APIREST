const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');

/**
 * @swagger
 * tags:
 *   name: Étudiants
 *   description: Gestion des étudiants
 */

/**
 * @swagger
 * /api/etudiants:
 *   get:
 *     summary: Récupérer la liste des étudiants
 *     tags: [Étudiants]
 *     responses:
 *       200:
 *         description: Succès. Liste de tous les étudiants récupérée.
 */
router.get('/', etudiantController.getAllEtudiants);

/**
 * @swagger
 * /api/etudiants/{id}:
 *   get:
 *     summary: Récupérer un étudiant par son ID
 *     tags: [Étudiants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'étudiant
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Étudiant non trouvé
 */
router.get('/:id', etudiantController.getEtudiantById);

/**
 * @swagger
 * /api/etudiants:
 *   post:
 *     summary: Ajouter un nouvel étudiant
 *     tags: [Étudiants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               filiere:
 *                 type: string
 *     responses:
 *       201:
 *         description: Étudiant créé avec succès
 *       401:
 *         description: Non autorisé (Token manquant ou invalide)
 */
router.post('/', etudiantController.createEtudiant);

/**
 * @swagger
 * /api/etudiants/{id}:
 *   put:
 *     summary: Mettre à jour un étudiant
 *     tags: [Étudiants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'étudiant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               filiere:
 *                 type: string
 *     responses:
 *       200:
 *         description: Étudiant mis à jour avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Étudiant non trouvé
 */
router.put('/:id', etudiantController.updateEtudiant);

/**
 * @swagger
 * /api/etudiants/{id}:
 *   delete:
 *     summary: Supprimer un étudiant
 *     tags: [Étudiants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'étudiant
 *     responses:
 *       200:
 *         description: Étudiant supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Étudiant non trouvé
 */
router.delete('/:id', etudiantController.deleteEtudiant);

module.exports = router;
