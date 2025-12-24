// src/api/BaseAPI.js
import axios from 'axios'
import router from '@/router'
import { BASE_URL } from '../../config.js'

export default class BaseAPI {
    constructor() {
        this.api = axios.create({
            baseURL: BASE_URL, // ← Base URL از config
            headers: {
                'Content-Type': 'application/json',
            }
        })

        // interceptor برای پاسخ‌ها
        this.api.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    router.push('/login') // ریدایرکت به لاگین
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

    patch(url, data, config = {}) {
        return this.api.patch(url, data, config).then(res => res.data)
    }

    delete(url, config = {}) {
        return this.api.delete(url, config).then(res => res.data)
    }
}
