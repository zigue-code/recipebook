// seed.js - À CRÉER à la racine pour peupler la DB
const mongoose = require('mongoose');
const Recipe = require('./src/models/Recipe');

const sampleRecipes = [
  {
    title: "Pâtes Carbonara",
    description: "Un classique italien simple et délicieux",
    ingredients: ["400g de pâtes", "200g de lardons", "3 œufs", "100g de parmesan", "Poivre noir"],
    instructions: "1. Cuire les pâtes\n2. Faire revenir les lardons\n3. Battre les œufs avec le parmesan\n4. Mélanger le tout hors du feu",
    prepTime: 20,
    difficulty: "facile",
    category: "plat",
    rating: 4
  },
  {
    title: "Tiramisu",
    description: "Le dessert italien préféré de tous",
    ingredients: ["250g de mascarpone", "3 œufs", "100g de sucre", "24 biscuits à la cuillère", "Café fort", "Cacao"],
    instructions: "1. Préparer le café et laisser refroidir\n2. Séparer les blancs des jaunes\n3. Mélanger mascarpone avec jaunes et sucre\n4. Monter les blancs en neige\n5. Tremper les biscuits dans le café\n6. Alterner couches de biscuits et crème\n7. Saupoudrer de cacao",
    prepTime: 30,
    difficulty: "moyen",
    category: "dessert",
    rating: 5
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/recipebook');
    console.log('✅ Connexion MongoDB établie');
    
    await Recipe.deleteMany({});
    console.log('🗑️ Anciennes recettes supprimées');
    
    await Recipe.insertMany(sampleRecipes);
    console.log('🌱 Recettes de test ajoutées');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();