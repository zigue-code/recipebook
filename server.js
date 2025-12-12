// server.js - VERSION CORRIGÉE
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Servir aussi le dossier `js` à la racine pour les scripts frontend
app.use('/js', express.static(path.join(__dirname, 'js')));

// ========== ROUTES ==========
// IMPORTANT : Ces routes doivent être importées
const recipeRoutes = require('./src/routes/recipes');
app.use('/api/recipes', recipeRoutes);

// Route santé pour Render
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RecipeBook API fonctionne!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes pour les pages HTML
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

app.get('/recipe', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recipe.html'));
});


// ========== CONNEXION MONGODB ==========
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipebook';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connecté avec succès'))
.catch(err => {
  console.error('❌ Erreur MongoDB:', err);
  process.exit(1);
});

// ========== GESTION DES ERREURS ==========
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// ========== PORT ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/recipes`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
});