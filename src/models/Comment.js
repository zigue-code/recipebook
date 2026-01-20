const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Commentaire requis'],
    minlength: [3, 'Minimum 3 caractères'],
    maxlength: [500, 'Maximum 500 caractères']
  },
  rating: {
    type: Number,
    min: [1, 'Minimum 1 étoile'],
    max: [5, 'Maximum 5 étoiles'],
    required: [true, 'Note requise']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);
