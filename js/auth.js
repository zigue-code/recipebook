// js/auth.js - Client API pour l'authentification
class AuthAPI {
    static get API_URL() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        } else {
            return window.location.origin + '/api';
        }
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static removeToken() {
        localStorage.removeItem('token');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    static async register(username, email, password, passwordConfirm) {
        const response = await fetch(`${this.API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, passwordConfirm })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur d\'enregistrement');
        }

        const data = await response.json();
        this.setToken(data.token);
        return data.user;
    }

    static async login(email, password) {
        const response = await fetch(`${this.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de connexion');
        }

        const data = await response.json();
        this.setToken(data.token);
        return data.user;
    }

    static logout() {
        this.removeToken();
        window.location.href = '/login.html';
    }

    static async getCurrentUser() {
        const response = await fetch(`${this.API_URL}/auth/me`, {
            headers: this.getAuthHeader()
        });

        if (!response.ok) {
            throw new Error('Non authentifié');
        }

        return await response.json();
    }
}
