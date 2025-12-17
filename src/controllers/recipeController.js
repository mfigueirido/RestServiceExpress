const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Associate rating with authenticated user
    const newRating = {
      score: req.body.score,
      comment: req.body.comment,
      userId: req.user.id,
    };

    recipe.ratings.push(newRating);
    await recipe.save();

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { id, ratingId } = req.params;
    const userId = req.user.id;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const rating = recipe.ratings.id(ratingId);
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Check if the rating belongs to the authenticated user
    if (rating.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden: You can only delete your own ratings',
      });
    }

    recipe.ratings.pull(ratingId);
    await recipe.save();

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
