const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Administrateurs
 *   description: Gestion des administrateurs (Routes protégées)
 */

router.use(auth);

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Récupérer la liste des administrateurs
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès. Liste de tous les administrateurs récupérée.
 *       401:
 *         description: Non autorisé
 */
router.get('/', adminController.getAllAdmins);

/**
 * @swagger
 * /api/admins/{id}:
 *   get:
 *     summary: Récupérer un administrateur par son ID
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'administrateur
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Administrateur non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', adminController.getAdminById);

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Ajouter un nouvel administrateur
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès
 *       401:
 *         description: Non autorisé
 */
router.post('/', adminController.createAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Mettre à jour un administrateur
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'administrateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Administrateur mis à jour avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Administrateur non trouvé
 */
router.put('/:id', adminController.updateAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Supprimer un administrateur
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'administrateur
 *     responses:
 *       200:
 *         description: Administrateur supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Administrateur non trouvé
 */
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
