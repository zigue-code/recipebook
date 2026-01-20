// src/routes/recipes.js - VERSION AVEC AUTHENTIFICATION
const express = require('express');
const Recipe = require('../models/Recipe');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// GET toutes les recettes (public)
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }).populate('userId', 'username');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET une recette (public)
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('userId', 'username');
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer une recette (protégé)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      userId: req.user.id
    });
    const savedRecipe = await recipe.save();
    await savedRecipe.populate('userId', 'username');
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT mettre à jour (protégé - owner seulement)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    
    // Vérifier que l'utilisateur est le propriétaire
    if (recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé à modifier cette recette' });
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'username');
    
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE supprimer (protégé - owner seulement)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    
    // Vérifier que l'utilisateur est le propriétaire
    if (recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé à supprimer cette recette' });
    }
    
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recette supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RECHERCHE (public)
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { ingredients: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).populate('userId', 'username');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;