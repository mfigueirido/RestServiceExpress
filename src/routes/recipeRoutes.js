const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Basic CRUD routes

/**
 * @openapi
 * /api/recipes/:
 *   post:
 *     summary: Crear unha nova receita
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipeRequest'
 *     responses:
 *       201:
 *         description: Receita creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
router.post('/', recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

// Route for adding a rating
router.post('/:id/ratings', recipeController.addRating);

module.exports = router;