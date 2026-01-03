import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        user: null,
        isAuthenticated: false,
    }),

    getters: {
        token: (state) => state.accessToken,
    },

    actions: {
        /* ---------- init (مهم) ---------- */
        init() {
            if (typeof window === 'undefined') return

            const token = localStorage.getItem('access_token')
            if (token) {
                this.accessToken = token
                this.isAuthenticated = true
            }
        },

        /* ---------- set token ---------- */
        setToken(token) {
            this.accessToken = token
            this.isAuthenticated = true
            localStorage.setItem('access_token', token)
        },

        /* ---------- logout ---------- */
        logout() {
            this.accessToken = null
            this.user = null
            this.isAuthenticated = false

            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        }
    }
})
