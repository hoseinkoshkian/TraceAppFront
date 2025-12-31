// src/api/BaseAPI.js
import axios from 'axios'
import router from '@/router'
import { BASE_URL } from '../../config.js'
import {useAuthStore} from "@/store/auth.js";


export default class BaseAPI {
    constructor() {
        this.api = axios.create({
            baseURL: BASE_URL, // ← Base URL از config
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
        this.api.interceptors.request.use(config => {
            const auth = useAuthStore()

            const token = auth.accessToken || localStorage.getItem('access_token')
            console.log(token)
            if (!config.skipAuth && token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
        this.api.interceptors.response.use(
            response => response,
            async error => {
                const auth = useAuthStore()
                if (error.response?.status === 401 && !error.config._isLoginRequest) {
                    auth.logout()
                    router.push('/')
                }
                return Promise.reject(error)
            }
        )
    }

    get(url, config = {}) {
        return this.api.get(url, config).then(res => res.data)
    }

    post(url, data, config = {}) {
        return this.api.post(url, data, config).then(res => res.data)
    }
    put(url, data, config = {}) {
        return this.api.put(url, data, config).then(res => res.data)
    }
    patch(url, data, config = {}) {
        return this.api.patch(url, data, config).then(res => res.data)
    }

    delete(url, config = {}) {
        return this.api.delete(url, config).then(res => res.data)
    }
}
