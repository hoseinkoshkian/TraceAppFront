// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: localStorage.getItem('access_token') || null,
        user: null,
        isAuthenticated: !!localStorage.getItem('access_token'),
    }),

    actions: {
        setToken(token) {
            this.accessToken = token
            this.isAuthenticated = true
            localStorage.setItem('access_token', token) // ذخیره در حافظه مرورگر
        },

        logout() {
            this.accessToken = null
            this.user = null
            this.isAuthenticated = false
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        }
    }
})