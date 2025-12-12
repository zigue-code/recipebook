// public/js/api.js - VERSION CORRIGÉE
class RecipeAPI {
    static get API_URL() {
        // S'adapte automatiquement à l'environnement
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        } else {
            return window.location.origin + '/api';
        }
    }

    static async getAll() {
        const response = await fetch(`${this.API_URL}/recipes`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de chargement');
        }
        return await response.json();
    }

    static async getById(id) {
        const response = await fetch(`${this.API_URL}/recipes/${id}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Recette non trouvée');
        }
        return await response.json();
    }

    static async create(recipeData) {
        const response = await fetch(`${this.API_URL}/recipes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de création');
        }
        return await response.json();
    }

    static async update(id, recipeData) {
        const response = await fetch(`${this.API_URL}/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de mise à jour');
        }
        return await response.json();
    }

    static async delete(id) {
        const response = await fetch(`${this.API_URL}/recipes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de suppression');
        }
        return await response.json();
    }

    static async search(query) {
        const response = await fetch(`${this.API_URL}/recipes/search/${encodeURIComponent(query)}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de recherche');
        }
        return await response.json();
    }
}