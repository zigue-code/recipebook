// src/models/Recipe.js
const mongoose = require('mongoose');

// Schéma simple pour débutant
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: {
    type: String,
    required: true
  },
  prepTime: {
    type: Number,  // en minutes
    default: 15
  },
  difficulty: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    default: 'facile'
  },
  category: {
    type: String,
    enum: ['entrée', 'plat', 'dessert', 'boisson', 'autre'],
    default: 'plat'
  },
  image: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);