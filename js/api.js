// public/js/api.js - VERSION AVEC AUTHENTIFICATION
class RecipeAPI {
    static get API_URL() {
        // S'adapte automatiquement à l'environnement
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        } else {
            return window.location.origin + '/api';
        }
    }

    static getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
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
            headers: { 
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
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
            headers: { 
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
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
            method: 'DELETE',
            headers: this.getAuthHeader()
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

// ✅ COMMENTS API
class CommentAPI {
    static get API_URL() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        } else {
            return window.location.origin + '/api';
        }
    }

    static getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    static async getByRecipeId(recipeId) {
        const response = await fetch(`${this.API_URL}/comments/recipe/${recipeId}`);
        if (!response.ok) {
            throw new Error('Erreur de chargement des commentaires');
        }
        return await response.json();
    }

    static async create(recipeId, text, rating) {
        const response = await fetch(`${this.API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify({ recipeId, text, rating })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de création du commentaire');
        }
        return await response.json();
    }

    static async delete(commentId) {
        const response = await fetch(`${this.API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: this.getAuthHeader()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de suppression');
        }
        return await response.json();
    }

    static async update(commentId, text, rating) {
        const response = await fetch(`${this.API_URL}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify({ text, rating })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de modification');
        }
        return await response.json();
    }
}

// ✅ SHARING API
class SharingAPI {
    static get API_URL() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        } else {
            return window.location.origin + '/api';
        }
    }

    static getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    static async getSharedWithMe() {
        const response = await fetch(`${this.API_URL}/sharing/with-me`, {
            headers: this.getAuthHeader()
        });
        if (!response.ok) {
            throw new Error('Erreur de chargement des recettes partagées');
        }
        return await response.json();
    }

    static async getMyShares() {
        const response = await fetch(`${this.API_URL}/sharing/my-shares`, {
            headers: this.getAuthHeader()
        });
        if (!response.ok) {
            throw new Error('Erreur de chargement des partages');
        }
        return await response.json();
    }

    static async shareRecipe(recipeId, username) {
        const response = await fetch(`${this.API_URL}/sharing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify({ recipeId, username })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de partage');
        }
        return await response.json();
    }

    static async removeShare(sharingId, userId) {
        const response = await fetch(`${this.API_URL}/sharing/${sharingId}/${userId}`, {
            method: 'DELETE',
            headers: this.getAuthHeader()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de suppression');
        }
        return await response.json();
    }
}