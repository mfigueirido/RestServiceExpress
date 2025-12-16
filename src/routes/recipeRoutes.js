const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

const auth = require('../middleware/auth');
router.use(auth);

// Basic CRUD routes

/**
 * @openapi
 * /api/recipes/:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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

// Ratings routes

/**
 * @openapi
 * /api/recipes/{id}/ratings/:
 *   post:
 *     tags: [Recipe ratings]
 *     summary: Create a new rating for a recipe
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/RatingRequest'
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe or rating not found
 */
router.post('/:id/ratings', recipeController.addRating);

/**
 * @openapi
 * /api/recipes/{id}/ratings/{ratingId}:
 *   delete:
 *     tags: [Recipe ratings]
 *     summary: Delete a specific rating from a recipe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: ratingId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe or rating not found
 */
router.delete('/:id/ratings/:ratingId', recipeController.deleteRating);

module.exports = router;
