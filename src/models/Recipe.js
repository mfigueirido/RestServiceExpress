const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
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
        _id: false,
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
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;

        ret.ratings = ret.ratings.map(rating => {
          const newRating = { ...rating };
          if (newRating._id) {
            newRating.id = newRating._id.toString();
            delete newRating._id;
          }
          return newRating;
        });

        if (ret.createdAt instanceof Date) {
          ret.createdAt = ret.createdAt.toISOString();
        }

        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;

        if (ret.createdAt instanceof Date) {
          ret.createdAt = ret.createdAt.toISOString();
        }

        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
