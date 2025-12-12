// public/js/main.js - Logique principale du frontend
class RecipeManager {
    constructor() {
        this.currentRecipes = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRecipes();
    }

    setupEventListeners() {
        // Recherche avec debounce
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.searchRecipes(e.target.value);
                }, 300);
            });
        }

        // Filtres
        const filterButtons = document.querySelectorAll('[data-filter]');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filter;
                const filterValue = e.target.dataset.value;
                this.applyFilter(filterType, filterValue);
            });
        });
    }

    async loadRecipes() {
        try {
            this.showLoading();
            const recipes = await RecipeAPI.getAll();
            this.currentRecipes = recipes;
            this.displayRecipes(recipes);
        } catch (error) {
            this.showError('Erreur de chargement des recettes');
            console.error('Erreur:', error);
        }
    }

    async searchRecipes(query) {
        if (!query.trim()) {
            this.loadRecipes();
            return;
        }

        try {
            this.showLoading();
            const recipes = await RecipeAPI.search(query);
            this.currentRecipes = recipes;
            this.displayRecipes(recipes);
        } catch (error) {
            this.showError('Erreur lors de la recherche');
            console.error('Erreur recherche:', error);
        }
    }

    applyFilter(filterType, filterValue) {
        let filteredRecipes = [...this.currentRecipes];

        if (filterType === 'category' && filterValue !== 'all') {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.category === filterValue);
        }

        if (filterType === 'difficulty' && filterValue !== 'all') {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === filterValue);
        }

        this.displayRecipes(filteredRecipes);
    }

    displayRecipes(recipes) {
        const container = document.getElementById('recipesContainer');
        
        if (!container) return;

        if (recipes.length === 0) {
            container.innerHTML = this.getNoResultsHTML();
            return;
        }

        let html = '';
        recipes.forEach(recipe => {
            html += this.getRecipeCardHTML(recipe);
        });

        container.innerHTML = html;
        this.setupRecipeCardEvents();
    }

    getRecipeCardHTML(recipe) {
        const difficultyClasses = {
            'facile': 'bg-green-100 text-green-800',
            'moyen': 'bg-yellow-100 text-yellow-800',
            'difficile': 'bg-red-100 text-red-800'
        };

        const difficultyClass = difficultyClasses[recipe.difficulty] || 'bg-gray-100 text-gray-800';

        return `
            <div class="recipe-card bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow" 
                 data-id="${recipe._id}" 
                 data-category="${recipe.category}">
                <div class="h-48 bg-gray-200 relative">
                    ${recipe.image ? 
                        `<img src="${recipe.image}" alt="${recipe.title}" class="w-full h-full object-cover" loading="lazy">` :
                        `<div class="w-full h-full flex items-center justify-center text-gray-400">
                            <i class="fas fa-utensils text-4xl"></i>
                        </div>`
                    }
                    <span class="absolute top-3 right-3 px-3 py-1 rounded-full ${difficultyClass} text-xs font-semibold">
                        ${recipe.difficulty}
                    </span>
                </div>
                <div class="p-5">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-bold text-xl text-gray-800 truncate">${recipe.title}</h3>
                        <span class="text-yellow-500 whitespace-nowrap">
                            ${this.getStarRating(recipe.rating)}
                        </span>
                    </div>
                    
                    <p class="text-gray-600 mb-4 line-clamp-2 h-12">${recipe.description}</p>
                    
                    <div class="mb-4">
                        <div class="flex items-center text-gray-500 mb-1">
                            <i class="fas fa-clock mr-2 text-sm"></i>
                            <span class="text-sm">${recipe.prepTime} min</span>
                        </div>
                        <div class="flex items-center text-gray-500">
                            <i class="fas fa-carrot mr-2 text-sm"></i>
                            <span class="text-sm">${recipe.ingredients.length} ingrédients</span>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500 capitalize">
                            ${recipe.category}
                        </span>
                        <button class="view-recipe-btn bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
                                data-id="${recipe._id}">
                            Voir la recette
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;
        return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    }

    getNoResultsHTML() {
        return `
            <div class="col-span-3 text-center py-16">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-700 mb-2">Aucune recette trouvée</h3>
                <p class="text-gray-500 mb-6">Essayez une autre recherche ou ajoutez une nouvelle recette</p>
                <button onclick="window.location.href='/add.html'" 
                        class="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600">
                    <i class="fas fa-plus mr-2"></i>Ajouter une recette
                </button>
            </div>
        `;
    }

    showLoading() {
        const container = document.getElementById('recipesContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="col-span-3 text-center py-16">
                <i class="fas fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
                <p class="text-gray-600">Chargement des recettes...</p>
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('recipesContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="col-span-3 text-center py-16">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-700 mb-2">Erreur</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="recipeManager.loadRecipes()" 
                        class="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600">
                    <i class="fas fa-redo mr-2"></i>Réessayer
                </button>
            </div>
        `;
    }

    setupRecipeCardEvents() {
        // Gestion des clics sur "Voir la recette"
        const viewButtons = document.querySelectorAll('.view-recipe-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const recipeId = e.target.dataset.id;
                this.viewRecipe(recipeId);
            });
        });

        // Clic sur toute la carte (optionnel)
        const recipeCards = document.querySelectorAll('.recipe-card');
        recipeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Éviter de déclencher si on clique sur le bouton
                if (!e.target.closest('.view-recipe-btn')) {
                    const recipeId = card.dataset.id;
                    this.viewRecipe(recipeId);
                }
            });
        });
    }

    viewRecipe(recipeId) {
        window.location.href = `/recipe.html?id=${recipeId}`;
    }

    // Méthode pour ajouter une recette via le formulaire
    async addRecipe(recipeData) {
        try {
            const newRecipe = await RecipeAPI.create(recipeData);
            
            // Afficher message de succès
            this.showSuccessMessage('Recette ajoutée avec succès !');
            
            // Rediriger vers la nouvelle recette après 2 secondes
            setTimeout(() => {
                window.location.href = `/recipe.html?id=${newRecipe._id}`;
            }, 2000);
            
            return newRecipe;
        } catch (error) {
            this.showErrorMessage('Erreur lors de l\'ajout de la recette');
            console.error('Erreur:', error);
            throw error;
        }
    }

    showSuccessMessage(message) {
        // Créer ou mettre à jour un élément de message
        let messageEl = document.getElementById('successMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'successMessage';
            messageEl.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg';
            document.body.appendChild(messageEl);
        }
        
        messageEl.innerHTML = `
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    showErrorMessage(message) {
        let messageEl = document.getElementById('errorMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'errorMessage';
            messageEl.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg';
            document.body.appendChild(messageEl);
        }
        
        messageEl.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

// Initialiser le gestionnaire de recettes
let recipeManager;

document.addEventListener('DOMContentLoaded', () => {
    recipeManager = new RecipeManager();
    
    // Exposer certaines méthodes globalement
    window.recipeManager = recipeManager;
    
    // Fonctions globales pour les boutons HTML
    window.loadRecipes = () => recipeManager.loadRecipes();
    window.filterByCategory = (category) => recipeManager.applyFilter('category', category);
    window.filterByDifficulty = (difficulty) => recipeManager.applyFilter('difficulty', difficulty);
    window.searchRecipes = (query) => recipeManager.searchRecipes(query);
    window.viewRecipe = (id) => recipeManager.viewRecipe(id);
});

// Fonctions utilitaires globales
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
    }
}

function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}