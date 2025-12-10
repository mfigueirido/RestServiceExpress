const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Basic CRUD routes
router.post('/', recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

// Route for adding a rating
router.post('/:id/ratings', recipeController.addRating);

module.exports = router;