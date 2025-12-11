const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },

  prepTime: {
    type: Number, // minutes
    required: true,
    min: 1,
  },

  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],

  steps: [String],

  tags: [String],

  author: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  ratings: [
    {
      userId: String,
      score: Number,
      comment: String,
    },
  ],
});

module.exports = mongoose.model('Recipe', RecipeSchema);
