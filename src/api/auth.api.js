// src/api/auth.api.js
import BaseAPI from './BaseAPI.js'

class AuthApi extends BaseAPI {
    login(credentials) {
        // credentials = { username, password }
        return this.post('/api/v1/users/auth/token/', credentials, { skipAuth: true })
    }

    register(data) {
        // data = { username, email, password }
        return this.post('/api/v1/auth/register/', data)
    }

    // رفرش توکن
    refreshToken(refresh) {
        return this.post('/api/v1/auth/token/refresh/', { refresh })
    }

    // خروج کاربر
    logout() {
        return this.post('/api/v1/users/auth/logout/')
    }
}

export const authApi = new AuthApi()
