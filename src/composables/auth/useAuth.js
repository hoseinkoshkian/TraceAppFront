// src/composables/useAuth.js
import { useMutation } from '@tanstack/vue-query'
import { authApi } from '@/api/auth.api'
import { ref } from 'vue'
import { useToast } from '@/composables/useToast.js'

const { showSuccess, showError } = useToast()

export function useLogin() {
    return useMutation({
        mutationFn: async (credentials) => {
            // credentials = { username, password }
            const res = await authApi.login({
                phone_number: credentials.phone_number,
                password: credentials.password
            })
            localStorage.setItem('access_token', res.access)
            localStorage.setItem('refresh_token', res.refresh)
            return res
        },
        onSuccess: () => showSuccess('ورود موفقیت‌آمیز بود!'),
        onError: (err) => showError(err.response?.data?.detail || 'خطا در ورود')
    })
}

export function useRegister() {
    return useMutation({
        mutationFn: async (data) => {
            // data = { username, email, password }
            return await authApi.register(data)
        },
        onSuccess: () => showSuccess('ثبت‌نام موفقیت‌آمیز بود!'),
        onError: (err) => showError(err.response?.data?.detail || 'خطا در ثبت‌نام')
    })
}

export function useLogout() {
    return useMutation({
        mutationFn: async () => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            await authApi.logout()
        },
        onSuccess: () => showSuccess('خروج انجام شد!')
    })
}
