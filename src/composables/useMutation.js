// src/composables/useMutation.js
import { ref } from 'vue'
import { queryClient } from './queryClient'

export function useMutation(mutationFn, options = {}) {
    const loading = ref(false)
    const error = ref(null)

    const mutate = async (variables) => {
        loading.value = true
        error.value = null
        try {
            const result = await mutationFn(variables)

            // invalidate کوئری‌های مرتبط بعد از میوتیشن
            if (options.invalidate) {
                options.invalidate.forEach(key => queryClient.invalidateQuery(key))
            }

            // اگر refetch هم خواسته شده
            if (options.refetch) {
                options.refetch.forEach(async key => {
                    const query = queryClient.getQuery(key)
                    if (query && query.fetcher) await query.fetcher()
                })
            }

            return result
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    return { mutate, loading, error }
}
