// src/composables/useQuery.js
import { ref, watchEffect } from 'vue'
import { queryClient } from './queryClient'

export function useQuery(key, fetcher, options = {}) {
    const data = ref(null)
    const error = ref(null)
    const status = ref('idle')

    const query = queryClient.getQuery(key) || {
        data: null,
        status: 'idle',
        error: null,
        subscribers: [],
        timestamp: 0
    }

    queryClient.setQuery(key, query)

    const fetchData = async () => {
        status.value = 'loading'
        query.status = 'loading'
        try {
            const result = await fetcher()
            data.value = result
            query.data = result
            query.status = 'success'
            query.timestamp = Date.now()
            queryClient.notify(key)
            status.value = 'success'
        } catch (err) {
            error.value = err
            query.error = err
            query.status = 'error'
            status.value = 'error'
        }
    }

    // اگر داده قبلا کش شده و stale-time تمام نشده، استفاده می‌کنیم
    const now = Date.now()
    if (query.data && options.staleTime && now - query.timestamp < options.staleTime) {
        data.value = query.data
        status.value = query.status
    } else {
        fetchData()
    }

    // subscribe برای تغییرات بعدی
    queryClient.subscribe(key, (newData) => {
        data.value = newData
    })

    return { data, status, error, refetch: fetchData }
}
