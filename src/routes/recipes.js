// src/routes/recipes.js - VERSION CORRIGÉE
const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

// GET toutes les recettes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET une recette
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer une recette
router.post('/', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT mettre à jour
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE supprimer
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    
    res.json({ message: 'Recette supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RECHERCHE
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { ingredients: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;