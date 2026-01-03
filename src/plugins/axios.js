// src/plugins/axios.js
import axios from 'axios'
import { BASE_URL } from '../../config'
import router from '@/router'
import { useAuthStore } from '@/store/auth'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
})

// Request interceptor
api.interceptors.request.use(config => {
    // ⚡ فقط وقتی درخواست ارسال میشه اجرا میشه
    const auth = useAuthStore()       // مطمئن شو Pinia قبل از mount اجرا شده
    const token = auth.accessToken || localStorage.getItem('access_token')

    if (!config.skipAuth && token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        // ⚡ فقط وقتی پاسخ خطا برمیگرده اجرا میشه
        const auth = useAuthStore()     // safe، circular dependency نداره

        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !error.config?._isLoginRequest
        ) {
            auth.logout()
            router.push('/')
        }

        return Promise.reject(error)
    }
)

export default api
