const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Basic CRUD routes

/**
 * @openapi
 * /api/recipes/:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeRequest'
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
router.post('/', recipeController.createRecipe);

/**
 * @openapi
 * /api/recipes/:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
router.get('/', recipeController.getAllRecipes);

/**
 * @openapi
 * /api/recipes/{id}:
 *   get:
 *     tags: [Recipes]
 *     summary: Get a recipe by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       '404':
 *         description: Not found
 */
router.get('/:id', recipeController.getRecipeById);

/**
 * @openapi
 * /api/recipes/{id}:
 *   put:
 *     tags: [Recipes]
 *     summary: Update a recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeRequest'
 *     responses:
 *       '200':
 *         description: Updated note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
router.put('/:id', recipeController.updateRecipe);

/**
 * @openapi
 * /api/recipes/{id}:
 *   delete:
 *     tags: [Recipes]
 *     summary: Delete a recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Deleted
 */
router.delete('/:id', recipeController.deleteRecipe);

// Route for adding a rating
router.post('/:id/ratings', recipeController.addRating);

module.exports = router;
