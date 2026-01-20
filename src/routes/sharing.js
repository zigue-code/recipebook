const express = require('express');
const SharedRecipe = require('../models/SharedRecipe');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// ✅ GET recettes partagées avec moi (protégé)
router.get('/with-me', authenticateToken, async (req, res) => {
  try {
    const sharedRecipes = await SharedRecipe.find({
      'sharedWith.userId': req.user.id
    })
      .populate('recipeId')
      .populate('ownerId', 'username')
      .sort({ createdAt: -1 });

    res.json(sharedRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET mes recettes partagées (protégé)
router.get('/my-shares', authenticateToken, async (req, res) => {
  try {
    const myShares = await SharedRecipe.find({ ownerId: req.user.id })
      .populate('recipeId')
      .populate('sharedWith.userId', 'username');

    res.json(myShares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Partager une recette avec un utilisateur (protégé - owner seulement)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { recipeId, username } = req.body;

    // Vérifier que la recette existe et que l'utilisateur en est le propriétaire
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    if (recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé à partager cette recette' });
    }

    // Vérifier que l'utilisateur existe
    const userToShare = await User.findOne({ username });
    if (!userToShare) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (userToShare._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas partager avec vous-même' });
    }

    // Trouver ou créer le partage
    let sharing = await SharedRecipe.findOne({ recipeId, ownerId: req.user.id });

    if (!sharing) {
      sharing = new SharedRecipe({
        recipeId,
        ownerId: req.user.id,
        sharedWith: [{ userId: userToShare._id }]
      });
    } else {
      // Vérifier si déjà partagé
      const alreadyShared = sharing.sharedWith.some(s => s.userId.toString() === userToShare._id.toString());
      if (alreadyShared) {
        return res.status(400).json({ error: 'Recette déjà partagée avec cet utilisateur' });
      }
      sharing.sharedWith.push({ userId: userToShare._id });
    }

    await sharing.save();
    await sharing.populate('recipeId');
    await sharing.populate('sharedWith.userId', 'username');

    res.status(201).json({ message: 'Recette partagée avec succès', sharing });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Retirer le partage (protégé - owner seulement)
router.delete('/:sharingId/:userId', authenticateToken, async (req, res) => {
  try {
    const sharing = await SharedRecipe.findById(req.params.sharingId);

    if (!sharing) {
      return res.status(404).json({ error: 'Partage non trouvé' });
    }

    if (sharing.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Retirer l'utilisateur de la liste de partage
    sharing.sharedWith = sharing.sharedWith.filter(s => s.userId.toString() !== req.params.userId);

    if (sharing.sharedWith.length === 0) {
      await SharedRecipe.findByIdAndDelete(req.params.sharingId);
    } else {
      await sharing.save();
    }

    res.json({ message: 'Partage retiré' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
