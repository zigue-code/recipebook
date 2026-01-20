const express = require('express');
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// ✅ GET tous les commentaires d'une recette (public)
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.recipeId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST créer un commentaire (protégé)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { recipeId, text, rating } = req.body;

    // Vérifier que la recette existe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    // Créer le commentaire
    const comment = new Comment({
      recipeId,
      userId: req.user.id,
      text,
      rating
    });

    const savedComment = await comment.save();
    await savedComment.populate('userId', 'username');

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ DELETE supprimer un commentaire (protégé - owner seulement)
router.delete('/:commentId', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé à supprimer ce commentaire' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ PUT modifier un commentaire (protégé - owner seulement)
router.put('/:commentId', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé à modifier ce commentaire' });
    }

    const { text, rating } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { text, rating },
      { new: true, runValidators: true }
    ).populate('userId', 'username');

    res.json(updatedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
