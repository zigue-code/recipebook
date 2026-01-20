// server.js - VERSION CORRIGÉE
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();  // IMPORTANT !

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Servir aussi le dossier `js` à la racine pour les scripts frontend
app.use('/js', express.static(path.join(__dirname, 'js')));

// Routes
const recipeRoutes = require('./src/routes/recipes');
const authRoutes = require('./src/routes/auth');
const commentRoutes = require('./src/routes/comments');
const sharingRoutes = require('./src/routes/sharing');
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/sharing', sharingRoutes);

// ✅ HEALTH CHECK OBLIGATOIRE
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// ✅ ROUTE POUR L'ACCUEIL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ✅ PORT POUR RENDER (OBLIGATOIRE)
const PORT = process.env.PORT || 3000;

// ✅ CONNEXION MONGODB AVEC GESTION D'ERREUR
// Utiliser la variable d'environnement si fournie, sinon basculer sur la DB locale
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipebook';

console.log('ℹ️ Utilisation de MONGODB_URI:', MONGODB_URI.startsWith('mongodb+srv://') ? '[atlas cluster]' : MONGODB_URI);

// Se connecter sans options dépréciées (Mongoose gère les options modernes)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    // DÉMARRER LE SERVEUR APRÈS CONNEXION DB
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err);
    process.exit(1);
  });