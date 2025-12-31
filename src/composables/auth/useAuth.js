// composables/auth/useAuth.js
import { useMutation } from '@tanstack/vue-query'
import { authApi } from '@/api/auth.api.js'
import {useAuthStore} from "@/store/auth.js";
import { useToast } from "@/composables/useToast.js"
import router from "@/router/index.js";

const { showSuccess, showError } = useToast()

export function useLogin() {
    const auth = useAuthStore()

    return useMutation({
        mutationFn: async (credentials) => {
            const res = await authApi.login(credentials)
            console.log('data is : ')
            console.log(res.data.data.access)
            auth.setToken(res.data.data.access) // فقط بعد از 200
            return res
        },
        onSuccess: () => {
            showSuccess('ورود موفقیت‌آمیز بود!')
            router.push('/dashboard') // ← فقط بعد از موفقیت
        },
        onError: (err) => {
            console.log('خطای ورود:', err)
            showError(err.response?.data?.detail || 'خطا در ورود')
            // هیچ ریدایرکتی انجام نمیشه
        }
    })
}
